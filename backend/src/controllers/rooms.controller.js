

// NEW: Import the Prisma client instance
import prisma from '../db/prisma.js'


const getRooms = async (req, res, next) => {
  try {
    // NEW: Get room types from the PostgreSQL database
    // const rooms = await prisma.roomType.findMany({
    //   include: {
    //     rooms: true,
    //   },
    // })

    const rooms = await prisma.roomType.findMany({
  orderBy: {
    displayOrder: 'asc',
  },
  include: {
    rooms: true,
  },
})

    console.log(rooms)
    res.json({
      status: 'success',
      rooms,
    })
  } catch (error) {
    // NEW: Pass database errors to the global error handler
    next(error)
  }
}

const getRoom = async (req, res, next) => {
  const { roomId } = req.params

  try {
    // NEW: Find the room type in PostgreSQL by its ID
    const room = await prisma.roomType.findUnique({
      where: {
        id: roomId,
      },

      // NEW: Include the actual physical rooms belonging to this room type
      include: {
        rooms: true,
      },
    })

    if (!room) {
      return res.status(404).json({
        status: 'error',
        message: 'Room not found',
      })
    }

    res.json({
      status: 'success',
      room,
    })
  } catch (error) {
    // NEW: Pass database errors to the global error handler
    next(error)
  }
}

export {
  getRooms,
  getRoom,
}
