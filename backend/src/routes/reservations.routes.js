
import { Router } from 'express'

// NEW: Import reservation controllers.
import {
  createReservation,
  getReservations,
  updateReservationStatus,
} from '../controllers/reservations.controller.js'

// NEW: Import the administrator authentication middleware.
// NEW: It verifies the JWT stored in the admin cookie.
import requireAdmin from '../middleware/auth.middleware.js'

// NEW: Create the reservations router.
const router = Router()

// NEW: Customers must be able to create reservations
// NEW: without being logged in as administrators.
router.post('/', createReservation)

// NEW: Only authenticated administrators can view reservations.
router.get(
  '/',
  requireAdmin,
  getReservations
)

// NEW: Only authenticated administrators can update
// NEW: a reservation's status.
// router.patch(
//   '/:reservationId/status',
//   requireAdmin,
//   updateReservationStatus
// )


router.patch(
  '/:reservationId/status',
  requireAdmin,
  (req, res, next) => {
    console.log('========== PATCH STATUS ROUTE HIT ==========')
    console.log('Reservation ID:', req.params.reservationId)
    console.log('Request body:', req.body)

    updateReservationStatus(req, res, next)
  }
)

// NEW: Export the reservations router.
export default router