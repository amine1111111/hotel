

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  checkAdminAuth,
  loginAdmin,
} from '../../../api/adminAuth'

// =====================================================
// FRONTEND ADMIN: LOGIN PAGE
// =====================================================

const Login = () => {
  console.log(
    '========== FRONTEND ADMIN: LOGIN PAGE =========='
  )

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [error, setError] = useState('')

  // =====================================================
  // FRONTEND ADMIN: CHECK EXISTING AUTH
  // =====================================================

  useEffect(() => {
    console.log(
      '========== FRONTEND ADMIN: CHECK EXISTING AUTH =========='
    )

    const checkExistingAuth = async () => {
      try {
        console.log(
          'Checking whether admin is already authenticated...'
        )

        const data = await checkAdminAuth()

        console.log(
          'Existing admin authentication result:',
          data
        )

        console.log(
          'Admin is already logged in'
        )

        console.log(
          'Navigating directly to /admin'
        )

        navigate('/admin', {
          replace: true,
        })
      } catch (error) {
        console.log(
          'No active admin session found'
        )

        console.log(
          'Showing frontend admin login form'
        )

        console.log(
          'Auth check error:',
          error
        )
      } finally {
        setIsCheckingAuth(false)

        console.log(
          '========== FRONTEND ADMIN: CHECK EXISTING AUTH END =========='
        )
      }
    }

    checkExistingAuth()
  }, [navigate])

  // =====================================================
  // FRONTEND ADMIN: LOGIN SUBMIT
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault()

    console.log(
      '========== FRONTEND ADMIN: LOGIN SUBMIT =========='
    )

    console.log('Login email:', email)
    console.log(
      'Login password provided:',
      Boolean(password)
    )

    setError('')
    setIsLoggingIn(true)

    try {
      console.log(
        'Sending login request to backend admin auth...'
      )

      const data = await loginAdmin({
        email,
        password,
      })

      console.log(
        'Frontend admin login result:',
        data
      )

      console.log(
        'Frontend admin login successful'
      )

      console.log(
        'Navigating to /admin'
      )

      navigate('/admin', {
        replace: true,
      })
    } catch (error) {
      console.error(
        '========== FRONTEND ADMIN: LOGIN FAILED =========='
      )

      console.error(
        'Frontend admin login error:',
        error
      )

      setError(
        error?.message ||
          'Login failed. Please check your credentials.'
      )
    } finally {
      setIsLoggingIn(false)

      console.log(
        '========== FRONTEND ADMIN: LOGIN END =========='
      )
    }
  }

  // =====================================================
  // FRONTEND ADMIN: AUTH CHECK LOADING
  // =====================================================

  if (isCheckingAuth) {
    console.log(
      'Frontend admin login: checking authentication...'
    )

    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
        <p className="text-sm text-stone-500">
          Checking authentication...
        </p>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
      <div className="w-full max-w-md">

        {/* =====================================================
            FRONTEND ADMIN: LOGIN HEADER
            ===================================================== */}

        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
            Hotel Administration
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900">
            Admin Login
          </h1>

          <p className="mt-2 text-sm leading-6 text-stone-500">
            Sign in to manage your hotel reservations and rooms.
          </p>
        </div>

        {/* =====================================================
            FRONTEND ADMIN: LOGIN FORM
            ===================================================== */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
        >
          {/* Email */}

          <div>
            <label
              htmlFor="admin-email"
              className="text-sm font-medium text-stone-700"
            >
              Email
            </label>

            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="admin@example.com"
              autoComplete="email"
              required
              className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:bg-white"
            />
          </div>

          {/* Password */}

          <div className="mt-5">
            <label
              htmlFor="admin-password"
              className="text-sm font-medium text-stone-700"
            >
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:bg-white"
            />
          </div>

          {/* Error */}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* Submit */}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="mt-6 w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoggingIn
              ? 'Signing in...'
              : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default Login