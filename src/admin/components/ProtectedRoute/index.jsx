import {
  useEffect,
  useState,
} from 'react'

import {
  Navigate,
  Outlet,
} from 'react-router-dom'

import { checkAdminAuth } from '../../../api/adminAuth'

const ProtectedRoute = () => {
  console.log(
    '========== FRONTEND ADMIN: PROTECTED ROUTE =========='
  )

  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // =====================================================
  // CHECK ADMIN AUTHENTICATION
  // =====================================================

  useEffect(() => {
    const verifyAdmin = async () => {
      console.log(
        'Checking frontend admin authentication...'
      )

      try {
        const data = await checkAdminAuth()

        console.log(
          'Frontend admin authentication successful:',
          data
        )

        setIsAuthenticated(true)
      } catch (error) {
        console.error(
          'Frontend admin authentication failed:',
          error
        )

        setIsAuthenticated(false)
      } finally {
        console.log(
          'Frontend admin authentication check finished'
        )

        setIsLoading(false)
      }
    }

    verifyAdmin()
  }, [])

  // =====================================================
  // AUTHENTICATION LOADING
  // =====================================================

  if (isLoading) {
    console.log(
      'Frontend admin route: checking authentication...'
    )

    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">

        <p className="text-sm text-stone-500">
          Checking authentication...
        </p>

      </div>
    )
  }

  // =====================================================
  // NOT AUTHENTICATED
  // =====================================================

  if (!isAuthenticated) {
    console.log(
      'Frontend admin route: not authenticated'
    )

    console.log(
      'Redirecting to /admin/login'
    )

    return (
      <Navigate
        to="/admin/login"
        replace
      />
    )
  }

  // =====================================================
  // AUTHENTICATED
  // =====================================================

  console.log(
    'Frontend admin route: authenticated'
  )

  console.log(
    'Rendering protected admin routes'
  )

  return <Outlet />
}

export default ProtectedRoute