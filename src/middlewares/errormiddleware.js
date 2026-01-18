// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  // Log error
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err.name);
    console.error('Message:', message);
    console.error('Stack:', err.stack);
  }

  // Handle specific error types
  if (err.name?.includes('Sequelize')) {
    return res.status(500).json({
      success: false,
      message: 'Database operation failed',
    });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;