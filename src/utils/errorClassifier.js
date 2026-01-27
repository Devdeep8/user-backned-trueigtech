// utils/errorClassifier.js

export class ErrorClassifier {
  static classify(error) {
    // Already classified AppError
    if (error.isOperational && error.type) {
      return {
        type: error.type,
        severity: this.getSeverity(error.statusCode),
        httpStatus: error.statusCode,
        retryable: error.retryable || false,
        alertTeam: error.statusCode >= 500,
      };
    }

    // Validation errors (400)
    if (
      error.statusCode === 400 ||
      error.message?.includes('required') ||
      error.message?.includes('invalid')
    ) {
      return {
        type: 'VALIDATION_ERROR',
        severity: 'warning',
        httpStatus: 400,
        retryable: false,
        alertTeam: false,
      };
    }

    // Authentication errors (401)
    if (
      error.statusCode === 401 ||
      error.message?.includes('password') ||
      error.message?.includes('token')
    ) {
      return {
        type: 'AUTHENTICATION_ERROR',
        severity: 'warning',
        httpStatus: 401,
        retryable: false,
        alertTeam: false,
      };
    }

    // Not found (404)
    if (error.statusCode === 404 || error.message?.includes('not found')) {
      return {
        type: 'NOT_FOUND_ERROR',
        severity: 'info',
        httpStatus: 404,
        retryable: false,
        alertTeam: false,
      };
    }

    // Database errors (503)
    if (error.name?.includes('Sequelize')) {
      return {
        type: 'DATABASE_ERROR',
        severity: 'error',
        httpStatus: 503,
        retryable: true,
        alertTeam: true,
      };
    }

    // Programmer errors (500)
    if (error.name === 'TypeError' || error.name === 'ReferenceError') {
      return {
        type: 'PROGRAMMER_ERROR',
        severity: 'critical',
        httpStatus: 500,
        retryable: false,
        alertTeam: true,
      };
    }

    // Default
    return {
      type: 'UNKNOWN_ERROR',
      severity: 'error',
      httpStatus: 500,
      retryable: false,
      alertTeam: true,
    };
  }

  static getSeverity(statusCode) {
    if (statusCode >= 500) return 'critical';
    if (statusCode >= 400) return 'warning';
    return 'info';
  }
}