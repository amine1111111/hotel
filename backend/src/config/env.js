// const HOTEL_TIMEZONE =
//   process.env.HOTEL_TIMEZONE || 'Africa/Algiers'


// const PORT = process.env.PORT || 5000

// const CLIENT_URL =
//   process.env.CLIENT_URL || 'http://localhost:5173'

// // NEW: Secret used to create and verify admin JWT tokens.
// const JWT_SECRET = process.env.JWT_SECRET

// // NEW: Make sure the application cannot start without a JWT secret.
// if (!JWT_SECRET) {
//   throw new Error('JWT_SECRET is not defined')
// }


// const BREVO_API_KEY = process.env.BREVO_API_KEY
// const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL
// const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME



// console.log(
//   '========== BACKEND TIMEZONE CONFIG =========='
// )

// console.log(
//   'Hotel timezone:',
//   HOTEL_TIMEZONE
// )

// console.log(
//   '============================================='
// )

// export {
//   PORT,
//   CLIENT_URL,
//   JWT_SECRET,
//   BREVO_API_KEY,
// BREVO_SENDER_EMAIL,
// BREVO_SENDER_NAME,
//  HOTEL_TIMEZONE
// }
































const HOTEL_TIMEZONE =
  process.env.HOTEL_TIMEZONE || 'Africa/Algiers'

const PORT = process.env.PORT || 5000

const CLIENT_URL =
  process.env.CLIENT_URL || 'http://localhost:5173'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined')
}

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME

export {
  PORT,
  CLIENT_URL,
  JWT_SECRET,
  BREVO_API_KEY,
  BREVO_SENDER_EMAIL,
  BREVO_SENDER_NAME,
  HOTEL_TIMEZONE,
}