
import { Router } from 'express'

import {
  loginAdmin,
  logoutAdmin,
} from '../controllers/auth.controller.js'

import requireAdmin from '../middleware/auth.middleware.js'

const router = Router()

// =====================================================
// ADMIN LOGIN
// =====================================================

router.post('/login', loginAdmin)

// =====================================================
// ADMIN LOGOUT
// =====================================================

router.post('/logout', requireAdmin, logoutAdmin)

// =====================================================
// ADMIN AUTH TEST
// =====================================================

router.get('/test', requireAdmin, (req, res) => {
  console.log(
    'Admin authentication test passed'
  )

  console.log(
    'Authenticated admin:',
    req.admin
  )

  res.json({
    status: 'success',
    message: 'Authentication successful',
    admin: req.admin,
  })
})

export default router