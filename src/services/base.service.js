// base.service.js
import {
  getErrorCode,
  getErrorType,
  httpStatus,
} from "../helper/http-status.js";
import db from "../model/db.js";
import AppError from "../utils/appError.js";

export class BaseService {
  constructor(args = {}, context = {}) {
    this.error = AppError;
    this.args = args;
    this.context = context;
    this.db = db;
    this.serviceName = this.constructor.name;
    this.httpStatus = httpStatus;
    this.startTime = Date.now();
  }

  async execute() {
    try {
      const result = await this.run();
      
      this.logSuccess();
      return this.buildSuccessResponse(result);
    } catch (error) {
      const validationError =
        error instanceof AppError
          ? error
          : new AppError(
              "Internal server error",
              httpStatus.INTERNAL_SERVER_ERROR,
              "SERVER_ERROR",
            );
      // Log the error for debugging
      this.logError(validationError.message);

      // Return standardized error format instead of throwing
      return this.buildErrorResponse(validationError);
    }
  }

  async run() {
    throw new Error("Method not implemented");
  }
  /**
   * Build standardized success response
   */
  buildSuccessResponse(result) {
    return {
      success: true,
      data: result, // raw result from service
      meta: {
        service: this.serviceName,
        executionTime: `${Date.now() - this.startTime}ms`,
        requestId: this.context?.requestId,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Build standardized error response with proper error codes
   */
  buildErrorResponse(error) {
    const statusCode =
      error.statusCode || this.httpStatus.INTERNAL_SERVER_ERROR;
    const errorCode = getErrorCode(statusCode);
    const errorType = getErrorType(statusCode);

    return {
      success: false,
      error: {
        message: error.message || "Something went wrong",
        code: errorCode,
        statusCode: statusCode,
        type: errorType,
      },
      meta: {
        service: this.serviceName,
        executionTime: `${Date.now() - this.startTime}ms`,
        requestId: this.context?.requestId,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Send response to client
   * Handles both success and error responses in one method
   */
  sendResponse(
    res,
    result,
    successMessage = "Operation successful",
    successCode = 200,
  ) {
    if (!result.success) {
      return res.status(result.error?.statusCode || 500).json({
        success: false,
        message: result.error?.message || "Something went wrong",
        meta: result.meta || {},
      });
    }

    // Merge message inside data instead of wrapping everything again
    const response = {
      ...this.buildSuccessResponse(result.data),
      message: successMessage,
    };

    return res.status(successCode).json(response);
  }

  /**
   * Log success for monitoring
   */
  logSuccess(message = "Operation successful") {
    console.log(`[${this.serviceName}] ✓ Success`, {
      message: message,
      service: this.serviceName,
      executionTime: `${Date.now() - this.startTime}ms`,
      requestId: this.context?.requestId,
      timestamp: new Date().toISOString(),
    });
  }

  logError(message = "Operation failed") {
    console.error(`[${this.serviceName}] ✗ Error`, {
      message: message,
      service: this.serviceName,
      executionTime: `${Date.now() - this.startTime}ms`,
      requestId: this.context?.requestId,
      timestamp: new Date().toISOString(),
    });
  }
}
