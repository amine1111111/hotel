


// import { useEffect, useState } from 'react'

// import {
//   Outlet,
//   useNavigate,
// } from 'react-router-dom'

// // import { io } from 'socket.io-client'
// import adminSocket from '../socket'
// import { logoutAdmin } from '../../api/adminAuth'

// import AdminNavigation from '../components/AdminNavigation'

// // =====================================================
// // FRONTEND ADMIN: ROOT / LAYOUT
// // =====================================================

// const Admin = () => {
//   console.log(
//     '========== FRONTEND ADMIN: ROOT PAGE =========='
//   )

//   const navigate = useNavigate()

//   const [isLoggingOut, setIsLoggingOut] = useState(false)

//   // =====================================================
//   // FRONTEND ADMIN: WEBSOCKET CONNECTION
//   // =====================================================
// // =====================================================
// // FRONTEND ADMIN: WEBSOCKET CONNECTION
// // =====================================================

// useEffect(() => {

//   console.log(
//     '========== FRONTEND ADMIN: WEBSOCKET START =========='
//   )

//   // ===================================================
//   // FRONTEND WEBSOCKET: CONNECTION
//   // ===================================================

//   console.log(
//     'Frontend admin: connecting to shared WebSocket...'
//   )

//   adminSocket.connect()

//   // ===================================================
//   // FRONTEND WEBSOCKET: CONNECTION SUCCESS
//   // ===================================================

//   const handleConnect = () => {

//     console.log(
//       '========== FRONTEND ADMIN: WEBSOCKET CONNECTED =========='
//     )

//     console.log(
//       'Frontend socket ID:',
//       adminSocket.id
//     )

//     console.log(
//       'Frontend admin WebSocket connection is ready'
//     )
//   }

//   adminSocket.on(
//     'connect',
//     handleConnect
//   )

//   // ===================================================
//   // FRONTEND WEBSOCKET: CONNECTION ERROR
//   // ===================================================

//   const handleConnectError = (error) => {

//     console.error(
//       '========== FRONTEND ADMIN: WEBSOCKET CONNECTION ERROR =========='
//     )

//     console.error(
//       'WebSocket connection error:',
//       error
//     )
//   }

//   adminSocket.on(
//     'connect_error',
//     handleConnectError
//   )

//   // ===================================================
//   // FRONTEND WEBSOCKET: DISCONNECT
//   // ===================================================

//   const handleDisconnect = (reason) => {

//     console.log(
//       '========== FRONTEND ADMIN: WEBSOCKET DISCONNECTED =========='
//     )

//     console.log(
//       'WebSocket disconnect reason:',
//       reason
//     )
//   }

//   adminSocket.on(
//     'disconnect',
//     handleDisconnect
//   )

//   // ===================================================
//   // FRONTEND WEBSOCKET: CLEANUP
//   // ===================================================

//   return () => {

//     console.log(
//       'Frontend admin: removing WebSocket listeners...'
//     )

//     adminSocket.off(
//       'connect',
//       handleConnect
//     )

//     adminSocket.off(
//       'connect_error',
//       handleConnectError
//     )

//     adminSocket.off(
//       'disconnect',
//       handleDisconnect
//     )

//     console.log(
//       'Frontend admin: disconnecting shared WebSocket...'
//     )

//     adminSocket.disconnect()

//     console.log(
//       'Frontend admin: shared WebSocket connection closed'
//     )
//   }

// }, [])
//   // =====================================================
//   // FRONTEND ADMIN: LOGOUT
//   // =====================================================

//   const handleLogout = async () => {

//     console.log(
//       '========== FRONTEND ADMIN: LOGOUT CLICKED =========='
//     )

//     setIsLoggingOut(true)

//     try {

//       const data = await logoutAdmin()

//       console.log(
//         'Frontend admin logout result:',
//         data
//       )

//       console.log(
//         'Admin logout successful'
//       )

//       console.log(
//         'Navigating to /admin/login'
//       )

//       navigate('/admin/login', {
//         replace: true,
//       })

//     } catch (error) {

//       console.error(
//         '========== FRONTEND ADMIN: LOGOUT FAILED =========='
//       )

//       console.error(
//         'Logout error:',
//         error
//       )

//     } finally {

//       setIsLoggingOut(false)

//       console.log(
//         '========== FRONTEND ADMIN: LOGOUT END =========='
//       )
//     }
//   }

//   return (
//     <div className="min-h-screen bg-stone-50 text-stone-900">

//       {/* =====================================================
//           ADMIN CONTENT
//           ===================================================== */}

//       <main className="min-h-screen">
//         <Outlet />
//       </main>

//       {/* =====================================================
//           ADMIN NAVIGATION
//           ===================================================== */}

//       <AdminNavigation />

//       {/* =====================================================
//           LOGOUT
//           ===================================================== */}

//       <button
//         type="button"
//         onClick={handleLogout}
//         disabled={isLoggingOut}
//         className="fixed right-6 top-6 z-50 rounded-full border border-stone-200 bg-white/70 px-4 py-2 text-sm font-medium text-stone-600 shadow-sm backdrop-blur-xl transition-colors hover:bg-white hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-50"
//       >
//         {isLoggingOut
//           ? 'Logging out...'
//           : 'Logout'}
//       </button>

//     </div>
//   )
// }

// export default Admin






















import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import QueryProvider from '../../providers/QueryProvider'

import adminSocket from '../socket'
import { logoutAdmin } from '../../api/adminAuth'
import AdminNavigation from '../components/AdminNavigation'

const Admin = () => {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    adminSocket.connect()

    const handleConnect = () => {}
    const handleConnectError = () => {}
    const handleDisconnect = () => {}

    adminSocket.on('connect', handleConnect)
    adminSocket.on('connect_error', handleConnectError)
    adminSocket.on('disconnect', handleDisconnect)

    return () => {
      adminSocket.off('connect', handleConnect)
      adminSocket.off('connect_error', handleConnectError)
      adminSocket.off('disconnect', handleDisconnect)
      adminSocket.disconnect()
    }
  }, [])

  const handleLogout = async () => {
  setIsLoggingOut(true)

  try {
    await logoutAdmin()

    navigate('/admin/login', {
      replace: true,
    })
  } catch {
    // Keep the user on the current page if logout fails.
  } finally {
    setIsLoggingOut(false)
  }
}
  return (
    <QueryProvider>
      <div className="min-h-screen bg-stone-50 text-stone-900">
        <main className="min-h-screen">
          <Outlet />
        </main>

        <AdminNavigation />

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="fixed right-6 top-6 z-50 rounded-full border border-stone-200 bg-white/70 px-4 py-2 text-sm font-medium text-stone-600 shadow-sm backdrop-blur-xl transition-colors hover:bg-white hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </QueryProvider>
  )
}

export default Admin;
