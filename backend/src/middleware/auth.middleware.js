// // NEW: Import jsonwebtoken so we can verify
// // NEW: the JWT stored inside the admin cookie.
// import jwt from 'jsonwebtoken'

// // NEW: Import the JWT secret used when the token was created.
// import { JWT_SECRET } from '../config/env.js'

// // NEW: Protect routes that should only be accessible
// // NEW: to authenticated hotel administrators.
// const requireAdmin = (req, res, next) => {
//   // NEW: Get the JWT from the HttpOnly cookie.
//   const token = req.cookies.admin_token

//   // NEW: Reject the request when the authentication
//   // NEW: cookie does not exist.
//   if (!token) {
//     const error = new Error(
//       'Authentication required'
//     )

//     error.statusCode = 401

//     return next(error)
//   }

//   try {
//     // NEW: Verify that the JWT was signed with our secret
//     // NEW: and that it has not expired.
//     const decodedToken = jwt.verify(
//       token,
//       JWT_SECRET
//     )

//     // NEW: Save the verified JWT information on the request.
//     // NEW: Later controllers can use req.admin.
//     req.admin = decodedToken

//     // NEW: Allow the request to continue to the controller.
//     next()
//   } catch (error) {
//     // NEW: Convert invalid or expired JWT errors
//     // NEW: into a clean authentication error.
//     const authError = new Error(
//       'Invalid or expired authentication'
//     )

//     authError.statusCode = 401

//     next(authError)
//   }
// }

// // NEW: Export the administrator authentication middleware.
// export default requireAdmin






















import jwt from 'jsonwebtoken'

import { JWT_SECRET } from '../config/env.js'

const requireAdmin = (req, res, next) => {
  console.log('========== ADMIN AUTH CHECK ==========')

  const token = req.cookies.admin_token

  console.log(
    'Admin authentication cookie exists:',
    Boolean(token)
  )

  if (!token) {
    console.error(
      'Authentication failed: no admin_token cookie'
    )

    const error = new Error(
      'Authentication required'
    )

    error.statusCode = 401

    return next(error)
  }

  try {
    console.log('Verifying admin JWT...')

    const decodedToken = jwt.verify(
      token,
      JWT_SECRET
    )

    console.log(
      'JWT verified successfully:',
      decodedToken
    )

    req.admin = decodedToken

    console.log(
      'Admin authentication successful'
    )

    next()
  } catch (error) {
    console.error(
      'JWT verification failed:',
      error.message
    )

    const authError = new Error(
      'Invalid or expired authentication'
    )

    authError.statusCode = 401

    next(authError)
  }
}

export default requireAdmin