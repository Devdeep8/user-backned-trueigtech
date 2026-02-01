// utils/AppError.js

class AppError extends Error {
  constructor(message, statusCode = 500, options = {} , service) {
    super(message);

    // HTTP status code
    this.statusCode = statusCode;
    this.status = statusCode; // Alias for compatibility
    
    // Operational vs Programmer error
    this.isOperational = true;
    this.service = service; // 👈 service name lives here
    
    // Error code (for API consumers)
    this.code = options.code || this.generateCode(statusCode);
    
    // Error type (for classification)
    this.type = options.type || this.inferType(statusCode);
    
    // Original error (if wrapping another error)
    this.cause = options.cause;
    
    // Additional metadata
    this.meta = options.meta || {};
    
    // Retry hint for clients
    this.retryable = options.retryable || false;
    
    // Timestamp
    this.timestamp = new Date().toISOString();

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  generateCode(statusCode) {
    const codeMap = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'RATE_LIMIT',
      500: 'INTERNAL_ERROR',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE',
      504: 'GATEWAY_TIMEOUT',
    };
    return codeMap[statusCode] || 'UNKNOWN_ERROR';
  }

  inferType(statusCode) {
    if (statusCode >= 400 && statusCode < 500) return 'CLIENT_ERROR';
    if (statusCode >= 500) return 'SERVER_ERROR';
    return 'UNKNOWN';
  }

  // Serialize for API response
  toJSON() {
    return {
      success: false,
      error: {
        message: this.message,
        code: this.code,
        type: this.type,
        status: this.statusCode,
        retryable: this.retryable,
        timestamp: this.timestamp,
        ...(this.meta && Object.keys(this.meta).length > 0 && { meta: this.meta }),
      },
    };
  }

  // Serialize for logging (includes stack)
  toLog() {
    return {
      message: this.message,
      code: this.code,
      type: this.type,
      status: this.statusCode,
      retryable: this.retryable,
      timestamp: this.timestamp,
      stack: this.stack,
      cause: this.cause ? {
        message: this.cause.message,
        name: this.cause.name,
        stack: this.cause.stack,
      } : undefined,
      meta: this.meta,
    };
  }
}

export default AppError;