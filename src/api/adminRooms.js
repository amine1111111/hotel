// const API_URL = 'http://localhost:5000/api'

const API_URL = `${import.meta.env.VITE_API_URL}/api`

export const getAdminRooms = async () => {
  console.log(
    '🟦 [ADMIN ROOMS API] Fetching admin room management data...',
  )

  const response = await fetch(
    `${API_URL}/admin/rooms`,
    {
      method: 'GET',
      credentials: 'include',
    },
  )

  console.log(
    '🟦 [ADMIN ROOMS API] Response status:',
    response.status,
  )

  if (!response.ok) {
    console.error(
      '🟥 [ADMIN ROOMS API] Failed to fetch admin rooms:',
      response.status,
    )

    const error = new Error(
      'Failed to fetch admin room management data',
    )

    error.status = response.status

    throw error
  }

  const data = await response.json()

  console.log(
    '🟩 [ADMIN ROOMS API] Admin room data received:',
    data,
  )

  return data
}

export const updateAdminRoomMaintenance = async (
  roomId,
  maintenance,
) => {
  console.log(
    '🟧 [ADMIN ROOM API] Updating maintenance state...',
    {
      roomId,
      maintenance,
    },
  )

  const response = await fetch(
    `${API_URL}/admin/rooms/${roomId}/maintenance`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        maintenance,
      }),
    },
  )

  console.log(
    '🟦 [ADMIN ROOM API] Maintenance response status:',
    response.status,
  )

  const data = await response.json()

  if (!response.ok) {
    console.error(
      '🟥 [ADMIN ROOM API] Maintenance update failed:',
      {
        roomId,
        maintenance,
        status: response.status,
        data,
      },
    )

    const error = new Error(
      data.message ||
        'Failed to update room maintenance state',
    )

    error.status = response.status
    error.data = data

    throw error
  }

  console.log(
    '🟩 [ADMIN ROOM API] Maintenance state updated successfully:',
    data,
  )

  return data
}

export const createAdminRoom = async (
  roomTypeId,
  roomNumber,
) => {
  console.log(
    '🟧 [ADMIN ROOM API] Creating physical room...',
    {
      roomTypeId,
      roomNumber,
    },
  )

  const response = await fetch(
    `${API_URL}/admin/rooms`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomTypeId,
        roomNumber,
      }),
    },
  )

  console.log(
    '🟦 [ADMIN ROOM API] Create room response status:',
    response.status,
  )

  const data = await response.json()

  if (!response.ok) {
    console.error(
      '🟥 [ADMIN ROOM API] Physical room creation failed:',
      {
        roomTypeId,
        roomNumber,
        status: response.status,
        data,
      },
    )

    const error = new Error(
      data.message ||
        'Failed to create physical room',
    )

    error.status = response.status
    error.data = data

    throw error
  }

  console.log(
    '🟩 [ADMIN ROOM API] Physical room created successfully:',
    data,
  )

  return data
}