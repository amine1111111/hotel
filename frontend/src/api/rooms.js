// const API_URL = 'http://localhost:5000/api'

const API_URL = `${import.meta.env.VITE_API_URL}/api`

// const transformRoom = (room) => ({
//   id: room.id,
//   type: room.type,
//   category: room.category,

//   name: room.name,
//   description: room.description,

//   size: room.size,

//   beds: {
//     type: room.bedType,
//     quantity: room.bedQuantity,
//     sleeps: room.bedSleeps,
//   },

//   capacity: {
//     maxAdults: room.maxAdults,
//     maxChildren: room.maxChildren,
//     maxGuests: room.maxGuests,
//   },

//   pricePerNight: room.pricePerNight,

//   amenities: room.amenities,

//   images: {
//     heroImg: room.heroImg,
//     roomCard: room.roomCard,
//     roomImg: room.roomImg,
//   },
// })

const transformRoom = (room) => ({
  id: room.id,
  type: room.type,
  category: room.category,

  name: room.name,
  description: room.description,

  size: room.size,

  beds: {
    type: room.bedType,
    quantity: room.bedQuantity,
    sleeps: room.bedSleeps,
  },

  capacity: {
    maxAdults: room.maxAdults,
    maxChildren: room.maxChildren,
    maxGuests: room.maxGuests,
  },

  pricePerNight: room.pricePerNight,

  amenities: room.amenities,

  images: {
    heroImg: room.heroImg,
    roomCard: room.roomCard,
    roomImg: room.roomImg,
  },

  // ADDED:
  // Keep the physical rooms returned by the backend.
  // The frontend admin will use these to display
  // the actual room numbers belonging to each room type.
  rooms: room.rooms ?? [],
})
const getRooms = async () => {
  const response = await fetch(`${API_URL}/rooms`)

  if (!response.ok) {
    throw new Error('Failed to fetch rooms')
  }

  const data = await response.json()

  console.log('Backend rooms:', data.rooms)

  const rooms = data.rooms.map(transformRoom)

  console.log(
  'Transformed frontend rooms:',
  rooms
)

console.log(
  'Physical rooms per room type:',
  rooms.map((room) => ({
    roomType: room.name,
    physicalRooms: room.rooms,
  }))
)
  // console.log('Transformed frontend rooms:', rooms)

  return rooms
}
const getRoom = async (id) => {
  const response = await fetch(`${API_URL}/rooms/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch room')
  }

  const data = await response.json()

  return transformRoom(data.room)
}


// getRooms()
//   .then((rooms) => {
//     console.log('getRooms() result:', rooms)
//   })
//   .catch((error) => {
//     console.error('getRooms() error:', error)
//   })





// getRoom('standard-single')
//   .then((room) => {
//     console.log('Single room from API:', room)
//   })
//   .catch((error) => {
//     console.error('getRoom() error:', error)
//   })


const checkAvailability = async ({
  roomId,
  checkIn,
  checkOut,
}) => {
  const url =
    `${API_URL}/rooms/${roomId}/availability` +
    `?checkIn=${encodeURIComponent(checkIn)}` +
    `&checkOut=${encodeURIComponent(checkOut)}`

  console.log('Checking room availability:', {
    roomId,
    checkIn,
    checkOut,
  })

  const response = await fetch(url)

  const data = await response.json()

  console.log('Availability response:', data)

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to check availability'
    )
  }

  return data
}

  
export {
  getRooms,
  getRoom,
  checkAvailability
}