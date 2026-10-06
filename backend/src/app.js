

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import healthRoutes from './routes/health.routes.js'
import roomsRoutes from './routes/rooms.routes.js'
import reservationsRoutes from './routes/reservations.routes.js'
import authRoutes from './routes/auth.routes.js'
import errorHandler from './middleware/error.middleware.js'
import { CLIENT_URL } from './config/env.js'


import adminRoomsRoutes from './routes/adminRooms.routes.js'


const app = express()

app.use(helmet())

// NEW: Allow the frontend to send and receive cookies
// NEW: when communicating with the backend.

// Why credentials: true?

// Normally, the browser doesn't allow cross-origin requests to include cookies unless both sides explicitly allow it.



app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })


)


// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "http://localhost:4173",
//       CLIENT_URL,
//     ],
//     credentials: true,
//   }),
// )

app.use(express.json())

// NEW: Parse incoming cookies and make them available
// NEW: through req.cookies.
app.use(cookieParser())

app.use('/api/health', healthRoutes)
app.use('/api/rooms', roomsRoutes)
app.use('/api/reservations', reservationsRoutes)

app.use('/api/auth', authRoutes)


app.use('/api/admin/rooms', adminRoomsRoutes)


app.use(errorHandler)

export default app
