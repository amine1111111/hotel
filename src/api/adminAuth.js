// const API_URL = 'http://localhost:5000/api'


const API_URL = `${import.meta.env.VITE_API_URL}/api`
// =====================================================
// FRONTEND ADMIN: LOGIN
// =====================================================

const loginAdmin = async ({ email, password }) => {
  console.log(
    '========== FRONTEND ADMIN: LOGIN =========='
  )

  console.log('Login email:', email)

  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        password,
      }),
    }
  )

  console.log(
    'Frontend admin login HTTP status:',
    response.status
  )

  const data = await response.json()

  console.log(
    'Frontend admin login response:',
    data
  )

  if (!response.ok) {
    throw new Error(
      data.message ||
      'Failed to login'
    )
  }

  console.log(
    'Frontend admin login successful'
  )

  console.log(
    '========== FRONTEND ADMIN: LOGIN SUCCESS =========='
  )

  return data
}


// =====================================================
// FRONTEND ADMIN: LOGOUT
// =====================================================

const logoutAdmin = async () => {
  console.log(
    '========== FRONTEND ADMIN: LOGOUT =========='
  )

  console.log(
    'Requesting:',
    `${API_URL}/auth/logout`
  )

  const response = await fetch(
    `${API_URL}/auth/logout`,
    {
      method: 'POST',
      credentials: 'include',
    }
  )

  console.log(
    'Frontend admin logout HTTP status:',
    response.status
  )

  const data = await response.json()

  console.log(
    'Frontend admin logout response:',
    data
  )

  if (!response.ok) {
    throw new Error(
      data.message ||
      'Failed to logout'
    )
  }

  console.log(
    'Frontend admin logout successful'
  )

  console.log(
    '========== FRONTEND ADMIN: LOGOUT SUCCESS =========='
  )

  return data
}


// =====================================================
// FRONTEND ADMIN: AUTH CHECK
// =====================================================

const checkAdminAuth = async () => {
  console.log(
    '========== FRONTEND ADMIN: AUTH CHECK =========='
  )

  const response = await fetch(
    `${API_URL}/auth/test`,
    {
      credentials: 'include',
    }
  )

  console.log(
    'Frontend admin auth check HTTP status:',
    response.status
  )

  const data = await response.json()

  console.log(
    'Frontend admin auth check response:',
    data
  )

  if (!response.ok) {
    throw new Error(
      data.message ||
      'Admin is not authenticated'
    )
  }

  console.log(
    'Frontend admin authentication confirmed'
  )

  console.log(
    '========== FRONTEND ADMIN: AUTH CHECK SUCCESS =========='
  )

  return data
}

export {
  loginAdmin,
  checkAdminAuth,
  logoutAdmin,
}