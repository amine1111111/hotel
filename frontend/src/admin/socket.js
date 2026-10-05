import { io } from 'socket.io-client'

// =====================================================
// FRONTEND ADMIN: SHARED WEBSOCKET CONNECTION
// =====================================================

// ! Important concept
// This creates ONE Socket.IO client instance that can be
// imported by different frontend admin files.
//
// ? Why do we need a shared socket?
// The Admin page manages the connection,
// while useAdminReservations needs to listen for
// reservation events and update the React Query cache.
//
// Both files must therefore use the SAME socket instance.

const adminSocket = io(
  import.meta.env.VITE_API_URL,
  {
    autoConnect: false,
  }
)

// * autoConnect: false means:
// The socket will NOT connect immediately when this file
// is imported.
//
// Admin will explicitly call:
// adminSocket.connect()

export default adminSocket