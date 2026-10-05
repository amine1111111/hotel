// NEW: Handle errors passed from controllers
const errorHandler = (error, req, res, next) => {
  // NEW: Log the actual error for development
  console.error(error)

  // NEW: Use the error's status code when one was provided
  const statusCode = error.statusCode || 500

  // NEW: Use the error's message when one was provided
  const message =
    error.statusCode ? error.message : 'Internal server error'

  res.status(statusCode).json({
    status: 'error',
    message,
  })
}

export default errorHandler