import { getIO } from '../socket.js'

// Import Prisma so we can use the Serializable transaction isolation level
import { Prisma } from '@prisma/client'

// Import the existing Prisma client
import prisma from '../db/prisma.js'

// Import the hotel date conversion and formatting helpers
import {
  createHotelDate,
  formatHotelDate,
} from '../utils/dates.js'

// Import the email service
import { sendEmail } from '../services/email.services.js'


// ============================================================
// TRANSACTION RETRY
// ============================================================

// ! PostgreSQL can reject a transaction when two requests
// ! try to modify related data at the same time.
//
// ? Prisma reports this as P2034.
// ? PostgreSQL can also expose the original error code 40001.
//
// ? We retry the transaction a few times instead of immediately
// ? failing the customer's reservation.

const runWithRetry = async (
  operation,
  maxRetries = 3
) => {

  for (
    let attempt = 1;
    attempt <= maxRetries;
    attempt++
  ) {

    try {

      return await operation()

    } catch (error) {

      const isSerializationError =
        error.code === 'P2034' ||
        error.cause?.originalCode === '40001'


      // ! If this is not a transaction conflict,
      // ! or we have used all retries, throw the error.

      if (
        !isSerializationError ||
        attempt === maxRetries
      ) {
        throw error
      }


      console.log(
        `Transaction conflict detected. Retrying... (${attempt}/${maxRetries})`
      )
    }
  }
}


// ============================================================
// CREATE RESERVATION
// ============================================================

const createReservation = async (
  req,
  res,
  next
) => {

  try {

    // ========================================================
    // GET RESERVATION DATA
    // ========================================================

    // Get booking information from the request

    const {
      roomId,
      checkIn,
      checkOut,
      adults,
      children,
      guestName,
      guestEmail,
      guestPhone,
    } = req.body


    // ========================================================
    // VALIDATE REQUIRED FIELDS
    // ========================================================

    // Make sure all required information was provided

    if (
      !roomId ||
      !checkIn ||
      !checkOut ||
      adults === undefined ||
      children === undefined ||
      !guestName ||
      !guestEmail ||
      !guestPhone
    ) {

      const error = new Error(
        'All reservation fields are required'
      )

      error.statusCode = 400

      throw error
    }


    // ============================================================
    // BACKEND RESERVATION: HOTEL DATE CONVERSION
    // ============================================================

    // ! Convert the customer's calendar dates using the hotel's
    // ! timezone instead of JavaScript's default UTC interpretation.
    //
    // ? The frontend sends:
    // ? "2026-09-18"
    //
    // ? createHotelDate() converts this into:
    // ? "2026-09-17T23:00:00.000Z"
    //
    // ? That UTC value represents:
    // ? "2026-09-18 00:00" in Africa/Algiers.

    


    const checkInDate =
      createHotelDate(checkIn)

    const checkOutDate =
      createHotelDate(checkOut)


    // ========================================================
    // VALIDATE DATES
    // ========================================================

    // Make sure the converted dates are valid

    if (
      Number.isNaN(
        checkInDate.getTime()
      ) ||
      Number.isNaN(
        checkOutDate.getTime()
      )
    ) {

      const error = new Error(
        'Invalid dates'
      )

      error.statusCode = 400

      throw error
    }


    // Make sure check-out is after check-in

    if (
      checkOutDate <= checkInDate
    ) {

      const error = new Error(
        'Check-out must be after check-in'
      )

      error.statusCode = 400

      throw error
    }


    // ========================================================
    // CREATE RESERVATION TRANSACTION
    // ========================================================

    const reservation =
      await runWithRetry(() =>
        prisma.$transaction(

          async (tx) => {

            // ==================================================
            // FIND ROOM TYPE
            // ==================================================

            const roomType =
  await tx.roomType.findUnique({

    where: {
      id: roomId,
    },

    include: {

      rooms: {

        // Maintenance rooms must never be assigned to guests.
        where: {
          maintenance: false,
        },

        include: {

          reservations: {

            where: {

              status: {
                in: [
                  'PENDING',
                  'CONFIRMED',
                ],
              },

              // Find reservations that overlap
              // the requested dates.
              checkIn: {
                lt: checkOutDate,
              },

              checkOut: {
                gt: checkInDate,
              },
            },
          },
        },
      },
    },
  })

            // ==================================================
            // ROOM TYPE NOT FOUND
            // ==================================================

            if (!roomType) {

              const error = new Error(
                'Room not found'
              )

              error.statusCode = 404

              throw error
            }


            // ==================================================
            // VALIDATE ROOM CAPACITY
            // ==================================================

            if (
              adults > roomType.maxAdults ||
              children > roomType.maxChildren ||
              adults + children >
                roomType.maxGuests
            ) {

              const error = new Error(
                'Number of guests exceeds room capacity'
              )

              error.statusCode = 400

              throw error
            }


            // ==================================================
            // FIND AVAILABLE PHYSICAL ROOM
            // ==================================================

            // ! A room type can have multiple physical rooms.
            //
            // ? We find the first physical room that does not
            // ? have a conflicting PENDING or CONFIRMED booking.

            const availableRoom =
              roomType.rooms.find(
                (room) =>
                  room.reservations.length === 0
              )


            // ==================================================
            // NO ROOM AVAILABLE
            // ==================================================

            if (!availableRoom) {

              const error = new Error(
                'Room is not available for these dates'
              )

              error.statusCode = 409

              throw error
            }


            // ==================================================
            // CALCULATE NUMBER OF NIGHTS
            // ==================================================

            const nights =
              Math.ceil(
                (
                  checkOutDate -
                  checkInDate
                ) /
                (
                  1000 *
                  60 *
                  60 *
                  24
                )
              )


            // ==================================================
            // CALCULATE TOTAL PRICE
            // ==================================================

            const totalPrice =
              roomType.pricePerNight *
              nights


            // ==================================================
            // CREATE DATABASE RESERVATION
            // ==================================================

            return tx.reservation.create({

              data: {

                physicalRoomId:
                  availableRoom.id,

                checkIn:
                  checkInDate,

                checkOut:
                  checkOutDate,

                adults,

                children,

                guestName,

                guestEmail,

                guestPhone,

                pricePerNight:
                  roomType.pricePerNight,

                totalPrice,
              },


              // ! Include the physical room and room type.
              //
              // ? The frontend admin needs this information
              // ? when it receives reservation:created.

              include: {

                physicalRoom: {

                  include: {
                    roomType: true,
                  },
                },
              },
            })
          },

          {
            // ! Serializable isolation protects the booking
            // ! transaction from concurrent reservation conflicts.

            isolationLevel:
              Prisma.TransactionIsolationLevel.Serializable,
          }
        )
      )


    // ============================================================
    // BACKEND WEBSOCKET: GET SHARED SOCKET.IO INSTANCE
    // ============================================================

    // ? server.js creates the Socket.IO server.
    // ? getIO() gives this controller access to that same instance.

    const io = getIO()

    console.log(
      '========== BACKEND WEBSOCKET: RESERVATION CONTROLLER HAS IO =========='
    )

    console.log(
      'Shared Socket.IO instance retrieved successfully'
    )


    // ============================================================
    // BACKEND WEBSOCKET: RESERVATION CREATED
    // ============================================================

    // ! The reservation has successfully been stored in the database.
    //
    // ? Now notify connected frontend admin dashboards.
    //
    // ? The frontend reservation hook receives this event and
    // ? updates the React Query cache without another GET request.

    console.log(
      '========== BACKEND WEBSOCKET: RESERVATION CREATED =========='
    )

    console.log(
      'Reservation created successfully:',
      reservation.id
    )

    console.log(
      'Broadcasting reservation:created event...'
    )


    io.emit(
      'reservation:created',
      reservation
    )


    console.log(
      'reservation:created event broadcast successfully'
    )


    // ========================================================
    // SEND SUCCESS RESPONSE
    // ========================================================

    res.status(201).json({

      status: 'success',

      reservation: {

        id:
          reservation.id,

        checkIn:
          reservation.checkIn,

        checkOut:
          reservation.checkOut,

        adults:
          reservation.adults,

        children:
          reservation.children,

        guestName:
          reservation.guestName,

        guestEmail:
          reservation.guestEmail,

        guestPhone:
          reservation.guestPhone,

        pricePerNight:
          reservation.pricePerNight,

        totalPrice:
          reservation.totalPrice,

        status:
          reservation.status,
      },
    })

  } catch (error) {

    next(error)
  }
}


// ============================================================
// GET RESERVATIONS
// ============================================================

const getReservations = async (
  req,
  res,
  next
) => {

  console.log(
    '========== GET RESERVATIONS START =========='
  )

  try {

    console.log(
      'Authenticated admin:',
      req.admin
    )

    const now = new Date()

    const completedVisibilityTime =
      new Date(
        now.getTime() -
          24 * 60 * 60 * 1000
      )

    console.log(
      'Admin reservation visibility cutoff:',
      completedVisibilityTime
    )

    console.log(
      'Fetching visible PENDING, CONFIRMED, and recent COMPLETED reservations...'
    )

    const reservations =
      await prisma.reservation.findMany({

        where: {

          OR: [

            {
              status: {
                in: [
                  'PENDING',
                  'CONFIRMED',
                ],
              },
            },

            {
              status: 'COMPLETED',

              checkOut: {
                gt:
                  completedVisibilityTime,
              },
            },

          ],
        },

        include: {

          physicalRoom: {

            include: {
              roomType: true,
            },
          },
        },

        orderBy: {
          createdAt: 'desc',
        },
      })

    console.log(
      'Visible admin reservations fetched successfully:',
      reservations.length
    )

    console.log(
      'Reservation statuses:',
      reservations.map(
        (reservation) => ({
          id: reservation.id,
          status: reservation.status,
          checkOut:
            reservation.checkOut,
        })
      )
    )

    console.log(
      'Reservation IDs:',
      reservations.map(
        (reservation) =>
          reservation.id
      )
    )

    console.log(
      '========== GET RESERVATIONS SUCCESS =========='
    )

    res.json({

      status: 'success',

      reservations,
    })

  } catch (error) {

    console.error(
      '========== GET RESERVATIONS ERROR =========='
    )

    console.error(
      'Error:',
      error
    )

    console.error(
      '========== END GET RESERVATIONS ERROR =========='
    )

    next(error)
  }
}
// ============================================================
// UPDATE RESERVATION STATUS
// ============================================================

const updateReservationStatus = async (
  req,
  res,
  next
) => {

  console.log(
    '========== UPDATE RESERVATION STATUS START =========='
  )

  try {

    const {
      reservationId,
    } = req.params

    const {
      status,
    } = req.body


    console.log(
      'Reservation ID:',
      reservationId
    )

    console.log(
      'Requested status:',
      status
    )

    console.log(
      'Authenticated admin:',
      req.admin
    )


    // ========================================================
    // VALIDATE STATUS
    // ========================================================

    const validStatuses = [
      'CONFIRMED',
      'CANCELLED',
    ]


    if (
      !validStatuses.includes(status)
    ) {

      console.error(
        'Invalid reservation status:',
        status
      )

      const error = new Error(
        'Invalid reservation status'
      )

      error.statusCode = 400

      throw error
    }


    console.log(
      'Status validation passed'
    )


    // ========================================================
    // FIND RESERVATION
    // ========================================================

    console.log(
      'Finding reservation in database...'
    )


    const reservation =
      await prisma.reservation.findUnique({

        where: {
          id: reservationId,
        },

        include: {

          physicalRoom: {

            include: {
              roomType: true,
            },
          },
        },
      })


    if (!reservation) {

      console.error(
        'Reservation not found:',
        reservationId
      )

      const error = new Error(
        'Reservation not found'
      )

      error.statusCode = 404

      throw error
    }


    console.log(
      'Reservation found:',
      {
        id: reservation.id,
        status: reservation.status,
        guestEmail: reservation.guestEmail,
      }
    )


    // ========================================================
    // ONLY PENDING RESERVATIONS CAN BE UPDATED
    // ========================================================

    if (
      reservation.status !== 'PENDING'
    ) {

      console.error(
        'Reservation is not PENDING:',
        reservation.status
      )

      const error = new Error(
        'Only pending reservations can be confirmed or cancelled'
      )

      error.statusCode = 400

      throw error
    }


    console.log(
      'Reservation is PENDING'
    )


    // ========================================================
    // CONFIRM RESERVATION
    // ========================================================

    if (
      status === 'CONFIRMED'
    ) {

      console.log(
        '========== CONFIRMING RESERVATION =========='
      )


      // ======================================================
      // UPDATE DATABASE
      // ======================================================

      console.log(
        'Updating reservation status to CONFIRMED...'
      )


      const updatedReservation =
        await prisma.reservation.update({

          where: {
            id: reservationId,
          },

          data: {
            status: 'CONFIRMED',
          },
        })


      console.log(
        'Reservation confirmed successfully:',
        {
          id: updatedReservation.id,
          oldStatus: reservation.status,
          newStatus: updatedReservation.status,
        }
      )


      // ======================================================
      // BACKEND WEBSOCKET: STATUS UPDATED
      // ======================================================

      // ! The database update has succeeded.
      //
      // ? Notify connected frontend admin dashboards.
      //
      // ? The frontend will update its React Query cache
      // ? without making another GET request.

      console.log(
        '========== BACKEND WEBSOCKET: RESERVATION STATUS UPDATED =========='
      )

      console.log(
        'Getting shared Socket.IO instance...'
      )


      const io = getIO()


      console.log(
        'Shared Socket.IO instance retrieved successfully'
      )

      console.log(
        'Broadcasting reservation:statusUpdated event...'
      )


      io.emit(
        'reservation:statusUpdated',
        updatedReservation
      )


      console.log(
        'reservation:statusUpdated event broadcast successfully'
      )


      // ======================================================
      // SEND CONFIRMATION EMAIL
      // ======================================================

      try {

        console.log(
          '========== CONFIRMATION EMAIL START =========='
        )

        console.log(
          'Email recipient:',
          reservation.guestEmail
        )


        await sendEmail({

          to:
            reservation.guestEmail,

          subject:
            'Your Hotel Reservation is Confirmed',

          htmlContent: `

            <h1>
              Reservation Confirmed
            </h1>

            <p>
              Hello ${reservation.guestName},
            </p>

            <p>
              Your reservation has been confirmed.
            </p>

            <h2>
              Reservation Details
            </h2>

            <p>
              <strong>
                Reservation Number:
              </strong>

              ${reservation.id}
            </p>

            <p>
              <strong>
                Room:
              </strong>

              ${reservation.physicalRoom.roomType.name}
            </p>

            <p>
              <strong>
                Check-in:
              </strong>

              ${formatHotelDate(
                reservation.checkIn
              )}
            </p>

            <p>
              <strong>
                Check-out:
              </strong>

              ${formatHotelDate(
                reservation.checkOut
              )}
            </p>

            <p>
              <strong>
                Adults:
              </strong>

              ${reservation.adults}
            </p>

            <p>
              <strong>
                Children:
              </strong>

              ${reservation.children}
            </p>

            <p>
              <strong>
                Price per night:
              </strong>

              ${reservation.pricePerNight}
              DA
            </p>

            <p>
              <strong>
                Total price:
              </strong>

              ${reservation.totalPrice}
              DA
            </p>

            <p>
              We look forward to welcoming you!
            </p>
          `,
        })


        console.log(
          'Confirmation email sent successfully'
        )

        console.log(
          '========== CONFIRMATION EMAIL SUCCESS =========='
        )

      } catch (emailError) {

        // ! Email failure does NOT undo the reservation confirmation.
        //
        // ? The database status is already CONFIRMED.
        // ? We log the email failure so it can be investigated.

        console.error(
          '========== CONFIRMATION EMAIL FAILED =========='
        )

        console.error(
          'Email could not be sent.'
        )

        console.error(
          'Reservation was still confirmed successfully.'
        )

        console.error(
          'Email error:',
          emailError
        )

        console.error(
          '========== END CONFIRMATION EMAIL ERROR =========='
        )
      }


      console.log(
        'Returning confirmed reservation'
      )

      console.log(
        '========== UPDATE RESERVATION STATUS SUCCESS =========='
      )


      return res.json({

        status: 'success',

        reservation:
          updatedReservation,
      })
    }


    // ========================================================
    // CANCEL RESERVATION
    // ========================================================

    if (
      status === 'CANCELLED'
    ) {

      console.log(
        '========== CANCELLING RESERVATION =========='
      )


      // ======================================================
      // SEND CANCELLATION EMAIL
      // ======================================================

      try {

        console.log(
          '========== CANCELLATION EMAIL START =========='
        )

        console.log(
          'Email recipient:',
          reservation.guestEmail
        )


        await sendEmail({

          to:
            reservation.guestEmail,

          subject:
            'Your Hotel Reservation has been Cancelled',

          htmlContent: `

            <h1>
              Reservation Cancelled
            </h1>

            <p>
              Hello ${reservation.guestName},
            </p>

            <p>
              Unfortunately, your hotel reservation
              has been cancelled.
            </p>

            <h2>
              Reservation Details
            </h2>

            <p>
              <strong>
                Reservation Number:
              </strong>

              ${reservation.id}
            </p>

            <p>
              <strong>
                Room:
              </strong>

              ${reservation.physicalRoom.roomType.name}
            </p>

            <p>
              <strong>
                Check-in:
              </strong>

              ${formatHotelDate(
                reservation.checkIn
              )}
            </p>

            <p>
              <strong>
                Check-out:
              </strong>

              ${formatHotelDate(
                reservation.checkOut
              )}
            </p>

            <p>
              <strong>
                Adults:
              </strong>

              ${reservation.adults}
            </p>

            <p>
              <strong>
                Children:
              </strong>

              ${reservation.children}
            </p>

            <p>
              <strong>
                Total price:
              </strong>

              ${reservation.totalPrice}
              DA
            </p>

            <p>
              Please contact the hotel if you have any questions.
            </p>
          `,
        })


        console.log(
          'Cancellation email sent successfully'
        )

        console.log(
          '========== CANCELLATION EMAIL SUCCESS =========='
        )

      } catch (emailError) {

        // ! The email failure does not stop cancellation.
        //
        // ? The reservation will still be deleted.

        console.error(
          '========== CANCELLATION EMAIL FAILED =========='
        )

        console.error(
          'Email could not be sent.'
        )

        console.error(
          'Reservation will still be deleted.'
        )

        console.error(
          'Email error:',
          emailError
        )

        console.error(
          '========== END CANCELLATION EMAIL ERROR =========='
        )
      }


      // ======================================================
      // DELETE RESERVATION
      // ======================================================

      console.log(
        'Deleting cancelled reservation from database...'
      )


      const deletedReservation =
        await prisma.reservation.delete({

          where: {
            id: reservationId,
          },
        })


      console.log(
        'Reservation deleted successfully:',
        {
          id: deletedReservation.id,
          guestEmail:
            deletedReservation.guestEmail,
        }
      )


      console.log(
        'Cancelled reservation no longer exists in database'
      )


      // ======================================================
      // BACKEND WEBSOCKET: RESERVATION CANCELLED
      // ======================================================

      // ! The reservation has been permanently deleted.
      //
      // ? Notify frontend admin dashboards so they can
      // ? remove it from their React Query cache.

      console.log(
        '========== BACKEND WEBSOCKET: RESERVATION CANCELLED =========='
      )

      console.log(
        'Getting shared Socket.IO instance...'
      )


      const io = getIO()


      console.log(
        'Shared Socket.IO instance retrieved successfully'
      )

      console.log(
        'Broadcasting reservation:cancelled event...'
      )


      io.emit(
        'reservation:cancelled',
        {
          id: deletedReservation.id,
        }
      )


      console.log(
        'reservation:cancelled event broadcast successfully'
      )


      console.log(
        '========== UPDATE RESERVATION STATUS SUCCESS =========='
      )


      return res.json({

        status: 'success',

        message:
          'Reservation cancelled and deleted successfully',
      })
    }

  } catch (error) {

    console.error(
      '========== UPDATE RESERVATION STATUS ERROR =========='
    )

    console.error(
      'Error:',
      error
    )

    console.error(
      '========== END RESERVATION STATUS ERROR =========='
    )

    next(error)
  }
}


// ============================================================
// EXPORTS
// ============================================================

export {
  createReservation,
  getReservations,
  updateReservationStatus,
}
