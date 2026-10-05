import 'dotenv/config'

import { createServer } from 'http'

import { Server } from 'socket.io'

import app from './src/app.js'
import { PORT } from './src/config/env.js'
import { initializeSocket } from './src/socket.js'


import {
  cleanupExpiredReservations,
} from './src/services/reservationCleanup.service.js'
// =====================================================
// BACKEND SERVER
// =====================================================

console.log(
  '========== BACKEND SERVER: STARTING =========='
)

// Create the HTTP server manually.
//
// ? Why?
// Socket.IO needs the underlying HTTP server.
//
// Express handles our normal HTTP API:
//
// Frontend → HTTP request → Express → HTTP response
//
// Socket.IO uses the same server:
//
// Frontend ←→ Socket.IO

const server = createServer(app)

// =====================================================
// BACKEND WEBSOCKET / SOCKET.IO SERVER
// =====================================================

const io = new Server(server, {

  // ? Socket.IO has its own CORS configuration.
  //
  // Express CORS handles normal API requests.
  // This CORS configuration handles Socket.IO connections.

  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },

})

// =====================================================
// BACKEND WEBSOCKET: SHARE IO INSTANCE
// =====================================================

// ! Important
//
// We created ONE Socket.IO server above.
//
// initializeSocket() makes that SAME instance available
// to other backend files such as reservation controllers.
//
// We do NOT create another Socket.IO server.

initializeSocket(io)

// =====================================================
// BACKEND WEBSOCKET: CLIENT CONNECTION
// =====================================================

io.on('connection', (socket) => {

  console.log(
    '========== BACKEND WEBSOCKET: CLIENT CONNECTED =========='
  )

  console.log(
    'Connected socket ID:',
    socket.id
  )

  console.log(
    'Total connected clients:',
    io.engine.clientsCount
  )

})




// =====================================================
server.listen(PORT, async () => {

  console.log(
    `Backend HTTP + WebSocket server running on port ${PORT}`
  )

  console.log(
    'Backend server ready'
  )

  console.log(
    '========== BACKEND SERVER: STARTED =========='
  )

  // ===================================================
  // BACKEND RESERVATION CLEANUP: INITIAL RUN
  // ===================================================

  console.log(
    '========== BACKEND RESERVATION CLEANUP: INITIAL RUN =========='
  )

  console.log(
    'Running reservation cleanup when backend starts...'
  )

  await cleanupExpiredReservations()

  console.log(
    'Initial reservation cleanup completed'
  )

  // ===================================================
  // BACKEND RESERVATION CLEANUP: AUTOMATIC SCHEDULER
  // ===================================================

  console.log(
    'Starting automatic reservation cleanup scheduler...'
  )

  // ! Run the cleanup every hour.
  //
  // ? We use milliseconds because setInterval expects
  // the interval duration in milliseconds.

  const CLEANUP_INTERVAL =
    60 * 60 * 1000


  setInterval(
    async () => {

      console.log(
        '========== BACKEND RESERVATION CLEANUP: SCHEDULED RUN =========='
      )

      console.log(
        'One hour has passed. Running automatic reservation cleanup...'
      )

      await cleanupExpiredReservations()

    },
    CLEANUP_INTERVAL
  )

  console.log(
    'Automatic reservation cleanup scheduler started.'
  )

})




