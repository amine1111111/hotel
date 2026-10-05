import {
  BREVO_API_KEY,
  BREVO_SENDER_EMAIL,
  BREVO_SENDER_NAME,
} from '../config/env.js'

const sendEmail = async ({
  to,
  subject,
  htmlContent,
}) => {
  const response = await fetch(
    'https://api.brevo.com/v3/smtp/email',
    {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          email: BREVO_SENDER_EMAIL,
          name: BREVO_SENDER_NAME,
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        htmlContent,
      }),
    }
  )

  if (!response.ok) {
    const errorBody = await response.text()

    const error = new Error(
      `Brevo email failed: ${response.status} ${errorBody}`
    )

    error.statusCode = response.status

    throw error
  }

  return response.json()
}

export { sendEmail }