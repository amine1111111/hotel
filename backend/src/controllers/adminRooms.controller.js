import prisma from '../db/prisma.js'

const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  orange: '\x1b[38;5;208m',
  reset: '\x1b[0m',
}

const logInfo = (message, data = '') => {
  console.log(
    `${colors.blue}🟦 [ADMIN ROOMS] ${message}${colors.reset}`,
    data,
  )
}

const logSuccess = (message, data = '') => {
  console.log(
    `${colors.green}🟩 [ADMIN ROOMS] ${message}${colors.reset}`,
    data,
  )
}

const logWarn = (message, data = '') => {
  console.warn(
    `${colors.yellow}🟨 [ADMIN ROOMS] ${message}${colors.reset}`,
    data,
  )
}

const logError = (message, data = '') => {
  console.error(
    `${colors.red}🟥 [ADMIN ROOMS] ${message}${colors.reset}`,
    data,
  )
}

const logRoom = (message, data = '') => {
  console.log(
    `${colors.orange}🟧 [ADMIN ROOM] ${message}${colors.reset}`,
    data,
  )
}

const getRoomStatus = (room, now) => {
  // Maintenance always takes priority over availability.
  if (room.maintenance) {
    return 'MAINTENANCE'
  }

  // Only an active confirmed reservation means the room is occupied.
  const activeReservation = room.reservations.find(
    (reservation) =>
      reservation.status === 'CONFIRMED' &&
      reservation.checkIn <= now &&
      reservation.checkOut > now,
  )

  if (activeReservation) {
    return 'OCCUPIED'
  }

  return 'AVAILABLE'
}

export const getAdminRooms = async (req, res, next) => {
  const startedAt = Date.now()

  logInfo('Fetching room management data...')

  try {
    const now = new Date()

    const roomTypes = await prisma.roomType.findMany({
      orderBy: {
        createdAt: 'asc',
      },

      include: {
        rooms: {
          orderBy: {
            roomNumber: 'asc',
          },

          include: {
            reservations: {
              where: {
                status: {
                  in: ['PENDING', 'CONFIRMED'],
                },
              },

              orderBy: {
                checkIn: 'asc',
              },

              select: {
                id: true,
                checkIn: true,
                checkOut: true,
                status: true,
              },
            },
          },
        },
      },
    })

    logSuccess(
      `Fetched ${roomTypes.length} room type(s) in ${Date.now() - startedAt}ms`,
    )

    let totalPhysicalRooms = 0
    let availableRooms = 0
    let occupiedRooms = 0
    let maintenanceRooms = 0

    const rooms = roomTypes.map((roomType) => {
      const physicalRooms = roomType.rooms.map((room) => {
        const status = getRoomStatus(room, now)

        totalPhysicalRooms += 1

        if (status === 'AVAILABLE') {
          availableRooms += 1
        }

        if (status === 'OCCUPIED') {
          occupiedRooms += 1
        }

        if (status === 'MAINTENANCE') {
          maintenanceRooms += 1
        }

        logRoom(`Room ${room.roomNumber} → ${status}`)

        return {
          id: room.id,
          roomNumber: room.roomNumber,
          maintenance: room.maintenance,
          status,

          currentReservation:
            status === 'OCCUPIED'
              ? room.reservations.find(
                  (reservation) =>
                    reservation.status === 'CONFIRMED' &&
                    reservation.checkIn <= now &&
                    reservation.checkOut > now,
                ) ?? null
              : null,
        }
      })

      return {
        id: roomType.id,
        type: roomType.type,
        category: roomType.category,
        name: roomType.name,
        description: roomType.description,
        size: roomType.size,
        pricePerNight: roomType.pricePerNight,
        maxAdults: roomType.maxAdults,
        maxChildren: roomType.maxChildren,
        maxGuests: roomType.maxGuests,
        bedType: roomType.bedType,
        bedQuantity: roomType.bedQuantity,
        bedSleeps: roomType.bedSleeps,
        amenities: roomType.amenities,
        heroImg: roomType.heroImg,
        roomCard: roomType.roomCard,
        roomImg: roomType.roomImg,
        physicalRooms,
      }
    })

    const overview = {
      totalPhysicalRooms,
      availableRooms,
      occupiedRooms,
      maintenanceRooms,
    }

    logSuccess(
      'Room overview calculated',
      overview,
    )

    res.status(200).json({
      status: 'success',
      overview,
      rooms,
    })
  } catch (error) {
    logError(
      'Failed to fetch admin room data',
      error,
    )

    next(error)
  }
}


export const createAdminRoom = async (
  req,
  res,
  next,
) => {
  const startedAt = Date.now()

  const {
    roomTypeId,
    roomNumber,
  } = req.body

  logInfo(
    'Creating physical room...',
    {
      roomTypeId,
      roomNumber,
    },
  )

  try {
    if (
      typeof roomTypeId !== 'string' ||
      !roomTypeId.trim()
    ) {
      logWarn(
        'Room type ID is missing or invalid',
        {
          roomTypeId,
        },
      )

      return res.status(400).json({
        status: 'error',
        message: 'Room type ID is required.',
      })
    }

    if (
      typeof roomNumber !== 'string' ||
      !roomNumber.trim()
    ) {
      logWarn(
        'Room number is missing or invalid',
        {
          roomNumber,
        },
      )

      return res.status(400).json({
        status: 'error',
        message: 'Room number is required.',
      })
    }

    const normalizedRoomTypeId =
      roomTypeId.trim()

    const normalizedRoomNumber =
      roomNumber.trim()

    if (
      !/^[0-9]+$/.test(
        normalizedRoomNumber,
      )
    ) {
      logWarn(
        'Invalid room number format',
        {
          roomNumber:
            normalizedRoomNumber,
        },
      )

      return res.status(400).json({
        status: 'error',
        message:
          'Room number must contain only numbers.',
      })
    }

    const roomType =
      await prisma.roomType.findUnique({
        where: {
          id: normalizedRoomTypeId,
        },
        select: {
          id: true,
          name: true,
        },
      })

    if (!roomType) {
      logWarn(
        'Room type not found',
        {
          roomTypeId:
            normalizedRoomTypeId,
        },
      )

      return res.status(404).json({
        status: 'error',
        message: 'Room type not found.',
      })
    }

    const existingRoom =
      await prisma.physicalRoom.findFirst({
        where: {
          roomNumber:
            normalizedRoomNumber,
        },
        select: {
          id: true,
          roomNumber: true,
          roomTypeId: true,
        },
      })

    if (existingRoom) {
      logWarn(
        'Room number already exists',
        {
          roomNumber:
            normalizedRoomNumber,
          existingRoom,
        },
      )

      return res.status(409).json({
        status: 'error',
        message: `Room ${normalizedRoomNumber} already exists.`,
      })
    }

    const roomId = `room-${normalizedRoomNumber}`

    const existingRoomId =
      await prisma.physicalRoom.findUnique({
        where: {
          id: roomId,
        },
        select: {
          id: true,
        },
      })

    const finalRoomId = existingRoomId
      ? `room-${normalizedRoomNumber}-${Date.now()}`
      : roomId

    const createdRoom =
      await prisma.physicalRoom.create({
        data: {
          id: finalRoomId,
          roomNumber:
            normalizedRoomNumber,
          maintenance: false,
          roomTypeId:
            normalizedRoomTypeId,
        },
        select: {
          id: true,
          roomNumber: true,
          maintenance: true,
          roomTypeId: true,
          roomType: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

    logSuccess(
      `Physical room ${createdRoom.roomNumber} created in ${Date.now() - startedAt}ms`,
      {
        roomId: createdRoom.id,
        roomTypeId:
          createdRoom.roomTypeId,
        roomType:
          createdRoom.roomType.name,
      },
    )

    logRoom(
      `Room ${createdRoom.roomNumber} → AVAILABLE`,
      {
        roomId: createdRoom.id,
        roomType:
          createdRoom.roomType.name,
      },
    )

    res.status(201).json({
      status: 'success',
      message: `Room ${createdRoom.roomNumber} created successfully.`,
      room: createdRoom,
    })
  } catch (error) {
    logError(
      'Failed to create physical room',
      {
        roomTypeId,
        roomNumber,
        error,
      },
    )

    next(error)
  }
}


export const updateRoomMaintenance = async (
  req,
  res,
  next,
) => {
  const startedAt = Date.now()

  const { roomId } = req.params
  const { maintenance } = req.body

  logInfo('Updating room maintenance state...', {
    roomId,
    maintenance,
  })

  try {
    // The request must contain a real boolean.
    if (typeof maintenance !== 'boolean') {
      logWarn(
        'Invalid maintenance value received',
        {
          roomId,
          maintenance,
        },
      )

      return res.status(400).json({
        status: 'error',
        message: 'Maintenance must be a boolean.',
      })
    }

    const updatedRoom =
      await prisma.$transaction(async (tx) => {
        // Find the physical room.
        const room =
          await tx.physicalRoom.findUnique({
            where: {
              id: roomId,
            },

            include: {
              roomType: {
                select: {
                  name: true,
                },
              },
            },
          })

        if (!room) {
          logWarn(
            'Physical room not found',
            {
              roomId,
            },
          )

          const error = new Error(
            'Physical room not found.',
          )

          error.statusCode = 404

          throw error
        }

        // Turning maintenance OFF is always allowed.
        if (!maintenance) {
          return tx.physicalRoom.update({
            where: {
              id: roomId,
            },

            data: {
              maintenance: false,
            },
          })
        }

        // Check whether this physical room has
        // a pending or confirmed reservation
        // that has not finished yet.
        const conflictingReservation =
          await tx.reservation.findFirst({
            where: {
              physicalRoomId: roomId,

              status: {
                in: ['PENDING', 'CONFIRMED'],
              },

              checkOut: {
                gt: new Date(),
              },
            },

            select: {
              id: true,
              checkIn: true,
              checkOut: true,
              status: true,
            },

            orderBy: {
              checkIn: 'asc',
            },
          })

        // Never remove a reserved room from inventory.
        if (conflictingReservation) {
          logWarn(
            'Maintenance request blocked by reservation',
            {
              roomId,
              roomNumber: room.roomNumber,
              reservationId:
                conflictingReservation.id,
              reservationStatus:
                conflictingReservation.status,
              checkIn:
                conflictingReservation.checkIn,
              checkOut:
                conflictingReservation.checkOut,
            },
          )

          const error = new Error(
            `Room ${room.roomNumber} has an existing reservation and cannot be placed into maintenance.`,
          )

          error.statusCode = 409

          throw error
        }

        // No active/future reservation exists,
        // so maintenance can safely be enabled.
        return tx.physicalRoom.update({
          where: {
            id: roomId,
          },

          data: {
            maintenance: true,
          },
        })
      })

    logSuccess(
      `Room ${updatedRoom.roomNumber} maintenance updated in ${Date.now() - startedAt}ms`,
      {
        roomId: updatedRoom.id,
        maintenance: updatedRoom.maintenance,
      },
    )

    logRoom(
      `Room ${updatedRoom.roomNumber} → ${
        updatedRoom.maintenance
          ? 'MAINTENANCE'
          : 'AVAILABLE'
      }`,
    )

    res.status(200).json({
      status: 'success',

      message: updatedRoom.maintenance
        ? 'Room placed into maintenance.'
        : 'Room removed from maintenance.',

      room: {
        id: updatedRoom.id,
        roomNumber: updatedRoom.roomNumber,
        maintenance: updatedRoom.maintenance,
      },
    })
  } catch (error) {
    logError(
      'Failed to update room maintenance state',
      {
        roomId,
        error,
      },
    )

    next(error)
  }
}