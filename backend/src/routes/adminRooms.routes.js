import { Router } from 'express'

import {
  getAdminRooms,
  createAdminRoom,
  updateRoomMaintenance,
} from '../controllers/adminRooms.controller.js'

import requireAdmin from '../middleware/auth.middleware.js'

const router = Router()

// Protect every admin room-management endpoint.
router.use(requireAdmin)

// Get room types, physical rooms, maintenance state, and current status.
router.get('/', getAdminRooms)


router.post(
  '/',
  createAdminRoom,
)

// Update the maintenance state of one physical room.
router.patch(
  '/:roomId/maintenance',
  updateRoomMaintenance,
)

export default router