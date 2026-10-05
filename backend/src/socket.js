import { Server } from 'socket.io'

// =====================================================
// BACKEND WEBSOCKET: SOCKET.IO INSTANCE
// =====================================================

// ? Why do we put io in its own file?
// The Socket.IO server is currently created inside server.js.
//
// But our reservation controller also needs access to the
// SAME Socket.IO instance so it can emit events.
//
// Instead of creating another Socket.IO server, we create
// one shared variable and initialize it from server.js.
//
// Then other backend files can import getIO().

// ! This variable will contain our single Socket.IO server.
let io = null

// =====================================================
// BACKEND WEBSOCKET: INITIALIZE SOCKET.IO
// =====================================================

// ? What does initializeSocket() do?
// It receives the Socket.IO server created in server.js
// and stores it in our shared variable.

export const initializeSocket = (socketServer) => {
  console.log(
    '========== BACKEND WEBSOCKET: INITIALIZING SHARED IO =========='
  )

  io = socketServer

  console.log(
    'Backend WebSocket shared io initialized successfully'
  )
}

// =====================================================
// BACKEND WEBSOCKET: GET SOCKET.IO INSTANCE
// =====================================================

// ? Why do we need getIO()?
// Controllers can call getIO() to retrieve the SAME
// Socket.IO instance that was created in server.js.
//
// Example:
//
// Reservation Controller
//        ↓
//      getIO()
//        ↓
// Same Socket.IO server
//        ↓
// Connected admin clients

export const getIO = () => {
  if (!io) {
    throw new Error(
      'Socket.IO has not been initialized'
    )
  }

  return io
}