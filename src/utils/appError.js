// utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode = 500, options = {}) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;

    // 🔥 THIS IS THE KEY
    this.cause = options.cause;
    this.meta = options.meta;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
