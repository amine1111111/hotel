import { Router } from 'express'

import {
  getRooms,
  getRoom,
} from '../controllers/rooms.controller.js'

import {
  checkAvailability,
} from '../controllers/availability.controller.js'

const router = Router()

router.get('/', getRooms)

router.get('/:roomId/availability', checkAvailability)
router.get('/:roomId', getRoom)

export default router


// ! rooms route, seed js, app js, and rooms controller