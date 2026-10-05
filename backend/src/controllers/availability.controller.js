// Import the hotel date conversion helper.
import { createHotelDate } from '../utils/dates.js'

// Import the existing Prisma client.
import prisma from '../db/prisma.js'

const checkAvailability = async (req, res, next) => {
  try {
    // Get the room type ID and requested dates.
    const { roomId } = req.params
    const { checkIn, checkOut } = req.query

    // Both dates are required.
    if (!checkIn || !checkOut) {
      return res.status(400).json({
        status: 'error',
        message: 'Check-in and check-out dates are required',
      })
    }

    // Convert calendar dates using the hotel's timezone.
    const checkInDate = createHotelDate(checkIn)
    const checkOutDate = createHotelDate(checkOut)

    // Validate the converted dates.
    if (
      Number.isNaN(checkInDate.getTime()) ||
      Number.isNaN(checkOutDate.getTime())
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid dates',
      })
    }

    // Check-out must be after check-in.
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Check-out must be after check-in',
      })
    }

    // Find the requested room type and only include
    // physical rooms that are not under maintenance.
    const roomType = await prisma.roomType.findUnique({
      where: {
        id: roomId,
      },
      include: {
        rooms: {
          where: {
            maintenance: false,
          },
          include: {
            reservations: {
              where: {
                status: {
                  in: ['PENDING', 'CONFIRMED'],
                },

                // Find reservations that overlap
                // the requested stay.
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

    // Make sure the room type exists.
    if (!roomType) {
      return res.status(404).json({
        status: 'error',
        message: 'Room not found',
      })
    }

    // A room is available when at least one
    // non-maintenance physical room has no
    // conflicting reservation.
    const available = roomType.rooms.some(
      (room) => room.reservations.length === 0
    )

    console.log(
      '🟦 [AVAILABILITY] Room availability checked:',
      {
        roomTypeId: roomId,
        checkIn,
        checkOut,
        bookablePhysicalRooms: roomType.rooms.length,
        available,
      },
    )

    // Return whether at least one physical room is available.
    res.json({
      status: 'success',
      available,
    })
  } catch (error) {
    console.error(
      '🟥 [AVAILABILITY] Failed to check room availability:',
      error,
    )

    next(error)
  }
}

export {
  checkAvailability,
}