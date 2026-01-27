// services/base.service.js

import { ErrorLogger } from '../utils/errorLogger.js';
import { ErrorClassifier } from '../utils/errorClassifier.js';

export class BaseService {
  constructor(error, args, context, db) {
    this.error = error;
    this.args = args;
    this.context = context;
    this.db = db;
    this.serviceName = this.constructor.name;
    this.startTime = Date.now();
  }

  async execute() {
    try {
      // Execute business logic
      const result = await this.run();
      
      // Log success (optional)
      this.logSuccess();
      
      // Return standardized success format
      return {
        success: true,
        data: result,
        meta: {
          service: this.serviceName,
          executionTime: `${Date.now() - this.startTime}ms`,
          requestId: this.context?.requestId,
          timestamp: new Date().toISOString(),
        },
      };
      
    } catch (error) {
      // Classify error
      const classification = ErrorClassifier.classify(error);
      
      // Log error with full context
      this.logError(error, classification);
      
      // Enrich error with metadata
      const enrichedError = this.enrichError(error, classification);
      
      // Re-throw for controller to handle
      throw enrichedError;
    }
  }

  logSuccess() {
    if (process.env.LOG_LEVEL === 'debug' || process.env.LOG_SUCCESS === 'true') {
      ErrorLogger.info({
        type: 'SERVICE_SUCCESS',
        serviceName: this.serviceName,
        message: `${this.serviceName} completed successfully`,
        executionTime: `${Date.now() - this.startTime}ms`,
        requestId: this.context?.requestId,
        userId: this.context?.user?.userId,
      });
    }
  }

  logError(error, classification) {
    ErrorLogger.log({
      level: classification.severity,
      serviceName: this.serviceName,
      executionTime: `${Date.now() - this.startTime}ms`,
      error: error.toLog ? error.toLog() : {
        name: error.name,
        message: error.message,
        code: error.code || 'UNKNOWN_ERROR',
        type: classification.type,
        stack: error.stack,
        httpStatus: error.statusCode || error.status || classification.httpStatus,
      },
      context: {
        requestId: this.context?.requestId,
        userId: this.context?.user?.userId,
        sessionId: this.context?.sessionId,
        ip: this.context?.ip,
        userAgent: this.context?.userAgent,
      },
      input: this.args,
      retryable: classification.retryable,
      alertTeam: classification.alertTeam,
    });
  }

  enrichError(error, classification) {
    // If already AppError, just add metadata
    if (error instanceof this.error) {
      error.meta = {
        ...error.meta,
        serviceName: this.serviceName,
        requestId: this.context?.requestId,
        userId: this.context?.userId,
        executionTime: `${Date.now() - this.startTime}ms`,
      };
      return error;
    }

    // Wrap unknown errors
    return new this.error(
      error.message || 'An unexpected error occurred',
      error.statusCode || error.status || classification.httpStatus || 500,
      {
        cause: error,
        code: error.code || `${this.serviceName.toUpperCase()}_ERROR`,
        type: classification.type,
        retryable: classification.retryable,
        meta: {
          serviceName: this.serviceName,
          requestId: this.context?.requestId,
          userId: this.context?.userId,
          executionTime: `${Date.now() - this.startTime}ms`,
        },
      }
    );
  }

  async run() {
    throw new Error('Method not implemented');
  }
}