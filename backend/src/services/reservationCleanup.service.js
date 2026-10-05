import prisma from '../db/prisma.js'
import { getIO } from '../socket.js'

export const cleanupExpiredReservations = async () => {
  console.log(
    '========== BACKEND RESERVATION CLEANUP: START =========='
  )

  try {
    const now = new Date()

    console.log(
      'Cleanup current time:',
      now
    )

    console.log(
      'Reservations with checkout time reached will be marked COMPLETED.'
    )

    console.log(
      'Searching for CONFIRMED reservations ready to be completed...'
    )

    const completedReservations =
      await prisma.reservation.findMany({
        where: {
          status: 'CONFIRMED',

          checkOut: {
            lte: now,
          },
        },

        select: {
          id: true,
          checkOut: true,
          guestName: true,
          guestEmail: true,
        },
      })

    console.log(
      'Reservations ready to be marked COMPLETED:',
      completedReservations.length
    )

    console.log(
      'Reservation IDs ready for completion:',
      completedReservations.map(
        (reservation) =>
          reservation.id
      )
    )

    if (
      completedReservations.length ===
      0
    ) {
      console.log(
        'No reservations are ready to be marked COMPLETED.'
      )

      console.log(
        '========== BACKEND RESERVATION CLEANUP: COMPLETE =========='
      )

      return
    }

    console.log(
      'Marking expired CONFIRMED reservations as COMPLETED...'
    )

    await prisma.reservation.updateMany({
      where: {
        id: {
          in: completedReservations.map(
            (reservation) =>
              reservation.id
          ),
        },
      },

      data: {
        status: 'COMPLETED',
      },
    })

    console.log(
      'Reservations marked COMPLETED successfully.'
    )

    console.log(
      'Getting shared Socket.IO instance...'
    )

    const io = getIO()

    console.log(
      'Shared Socket.IO instance retrieved successfully.'
    )

    completedReservations.forEach(
      (reservation) => {
        console.log(
          'Broadcasting reservation:completed event:',
          reservation.id
        )

        io.emit(
          'reservation:completed',
          {
            id: reservation.id,
          }
        )
      }
    )

    console.log(
      'Frontend reservation completion events broadcast successfully.'
    )

    console.log(
      '========== BACKEND RESERVATION CLEANUP: SUCCESS =========='
    )
  } catch (error) {
    console.error(
      '========== BACKEND RESERVATION CLEANUP: ERROR =========='
    )

    console.error(
      'Reservation cleanup error:',
      error
    )

    console.error(
      '========== END BACKEND RESERVATION CLEANUP ERROR =========='
    )
  }
}