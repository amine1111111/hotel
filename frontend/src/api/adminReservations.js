// const API_URL = 'http://localhost:5000/api'

const API_URL = `${import.meta.env.VITE_API_URL}/api`
const getAdminReservations = async () => {
  console.log('========== FRONTEND ADMIN: GET RESERVATIONS ==========')
  console.log(
    'Requesting:',
    `${API_URL}/reservations`
  )

  const response = await fetch(
    `${API_URL}/reservations`,
    {
      credentials: 'include',
    }
  )

  console.log(
    'Frontend admin reservations HTTP status:',
    response.status
  )

  const data = await response.json()

  console.log(
    'Frontend admin reservations response:',
    data
  )

  if (!response.ok) {
    throw new Error(
      data.message ||
      'Failed to fetch admin reservations'
    )
  }

  console.log(
    'Frontend admin reservations fetched:',
    data.reservations.length
  )

  console.log(
    '========== FRONTEND ADMIN: GET RESERVATIONS SUCCESS =========='
  )

  return data.reservations
}


const updateAdminReservationStatus = async (
  reservationId,
  status
) => {
  console.log(
    '========== FRONTEND ADMIN: UPDATE RESERVATION =========='
  )

  console.log('Reservation ID:', reservationId)
  console.log('New status:', status)

  const url =
    `${API_URL}/reservations/${reservationId}/status`

  console.log('Requesting:', url)

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      status,
    }),
  })

  console.log(
    'Update reservation HTTP status:',
    response.status
  )

  const data = await response.json()

  console.log(
    'Update reservation response:',
    data
  )

  if (!response.ok) {
    throw new Error(
      data.message ||
      'Failed to update reservation status'
    )
  }

  console.log(
    'Reservation status updated successfully'
  )

  console.log(
    '========== FRONTEND ADMIN: UPDATE RESERVATION SUCCESS =========='
  )

  return data.reservation
}

export {
  getAdminReservations,
  updateAdminReservationStatus
}