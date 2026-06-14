const errorHandler = (err, req, res, next) => {
  console.error('💥 Error Stack:', err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle MongoDB invalid ObjectId cast errors
  if (err.name === 'BSONError' || err.message.includes('Argument passed in must be a string of 12 bytes')) {
    statusCode = 400;
    message = 'Resource not found with that invalid ID format.';
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
