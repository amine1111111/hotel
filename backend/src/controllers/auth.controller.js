



// import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'

// import prisma from '../db/prisma.js'
// import { JWT_SECRET } from '../config/env.js'

// const loginAdmin = async (req, res, next) => {
//   console.log('========== ADMIN LOGIN START ==========')

//   try {
//     const { email, password } = req.body

//     console.log('Login request received:', {
//       email,
//       passwordProvided: Boolean(password),
//     })

//     if (!email || !password) {
//       console.error('Login failed: missing email or password')

//       const error = new Error(
//         'Email and password are required'
//       )

//       error.statusCode = 400

//       throw error
//     }

//     console.log('Searching for admin:', email)

//     const admin = await prisma.admin.findUnique({
//       where: {
//         email,
//       },
//     })

//     console.log(
//       'Admin found:',
//       Boolean(admin)
//     )

//     if (!admin) {
//       console.error('Login failed: admin not found')

//       const error = new Error(
//         'Invalid email or password'
//       )

//       error.statusCode = 401

//       throw error
//     }

//     console.log('Comparing password...')

//     const passwordMatches = await bcrypt.compare(
//       password,
//       admin.password
//     )

//     console.log(
//       'Password matches:',
//       passwordMatches
//     )

//     if (!passwordMatches) {
//       console.error('Login failed: incorrect password')

//       const error = new Error(
//         'Invalid email or password'
//       )

//       error.statusCode = 401

//       throw error
//     }

//     console.log('Creating JWT...')

//     const token = jwt.sign(
//       {
//         adminId: admin.id,
//       },
//       JWT_SECRET,
//       {
//         expiresIn: '1d',
//       }
//     )

//     console.log('JWT created successfully')

//     res.cookie(
//       'admin_token',
//       token,
//       {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'lax',
//         maxAge: 24 * 60 * 60 * 1000,
//       }
//     )

//     console.log('Admin authentication cookie set')

//     console.log(
//       'Admin login successful:',
//       {
//         id: admin.id,
//         email: admin.email,
//       }
//     )

//     console.log('========== ADMIN LOGIN SUCCESS ==========')

//     res.json({
//       status: 'success',
//       admin: {
//         id: admin.id,
//         email: admin.email,
//       },
//     })
//   } catch (error) {
//     console.error(
//       '========== ADMIN LOGIN ERROR ==========',
//       error
//     )

//     next(error)
//   }
// }

// const logoutAdmin = async (req, res, next) => {
//   try {
//     console.log(
//       '========== BACKEND: ADMIN LOGOUT =========='
//     )

//     console.log(
//       'Logging out admin:',
//       req.admin
//     )

//     res.clearCookie('admin_token', {
//       httpOnly: true,
//       sameSite: 'lax',
//       secure: false,
//     })

//     console.log(
//       'Admin token cookie cleared'
//     )

//     console.log(
//       '========== BACKEND: ADMIN LOGOUT SUCCESS =========='
//     )

//     res.json({
//       status: 'success',
//       message: 'Admin logged out successfully',
//     })
//   } catch (error) {
//     console.error(
//       '========== BACKEND: ADMIN LOGOUT FAILED =========='
//     )

//     console.error(
//       'Logout error:',
//       error
//     )

//     next(error)
//   }
// }

// export {
//   loginAdmin,
//   logoutAdmin
// }






import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import prisma from '../db/prisma.js'
import { JWT_SECRET } from '../config/env.js'

const loginAdmin = async (req, res, next) => {
  console.log('========== ADMIN LOGIN START ==========')

  try {
    const { email, password } = req.body

    console.log('Login request received:', {
      email,
      passwordProvided: Boolean(password),
    })

    if (!email || !password) {
      console.error('Login failed: missing email or password')

      const error = new Error(
        'Email and password are required'
      )

      error.statusCode = 400

      throw error
    }

    console.log('Searching for admin:', email)

    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    })

    console.log(
      'Admin found:',
      Boolean(admin)
    )

    if (!admin) {
      console.error('Login failed: admin not found')

      const error = new Error(
        'Invalid email or password'
      )

      error.statusCode = 401

      throw error
    }

    console.log('Comparing password...')

    const passwordMatches = await bcrypt.compare(
      password,
      admin.password
    )

    console.log(
      'Password matches:',
      passwordMatches
    )

    if (!passwordMatches) {
      console.error('Login failed: incorrect password')

      const error = new Error(
        'Invalid email or password'
      )

      error.statusCode = 401

      throw error
    }

    console.log('Creating JWT...')

    const token = jwt.sign(
      {
        adminId: admin.id,
      },
      JWT_SECRET,
      {
        expiresIn: '1d',
      }
    )

    console.log('JWT created successfully')

    res.cookie(
      'admin_token',
      token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
      }
    )

    console.log('Admin authentication cookie set')

    console.log(
      'Admin login successful:',
      {
        id: admin.id,
        email: admin.email,
      }
    )

    console.log('========== ADMIN LOGIN SUCCESS ==========')

    res.json({
      status: 'success',
      admin: {
        id: admin.id,
        email: admin.email,
      },
    })
  } catch (error) {
    console.error(
      '========== ADMIN LOGIN ERROR ==========',
      error
    )

    next(error)
  }
}

const logoutAdmin = async (req, res, next) => {
  try {
    console.log(
      '========== BACKEND: ADMIN LOGOUT =========='
    )

    console.log(
      'Logging out admin:',
      req.admin
    )

    res.clearCookie('admin_token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })

    console.log(
      'Admin token cookie cleared'
    )

    console.log(
      '========== BACKEND: ADMIN LOGOUT SUCCESS =========='
    )

    res.json({
      status: 'success',
      message: 'Admin logged out successfully',
    })
  } catch (error) {
    console.error(
      '========== BACKEND: ADMIN LOGOUT FAILED =========='
    )

    console.error(
      'Logout error:',
      error
    )

    next(error)
  }
}

export {
  loginAdmin,
  logoutAdmin
}