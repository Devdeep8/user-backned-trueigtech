// base.service.js
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

      // Log the result for debugging
      console.log(`[${this.serviceName}] Result:`, result);
      
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
      // Log the error for debugging
      console.error(`[${this.serviceName}] Error:`, {
        message: error.message,
        code: error.code || 'INTERNAL_ERROR',
        statusCode: error.statusCode || 500,
        requestId: this.context?.requestId,
        timestamp: new Date().toISOString(),
      });
      
      // Return standardized error format instead of throwing
      return {
        success: false,
        error: {
          message: error.message || 'Something went wrong',
          code: error.code || 'INTERNAL_ERROR',
          statusCode: error.statusCode || 500,
          type: error.type || 'SERVER_ERROR',
        },
        meta: {
          service: this.serviceName,
          executionTime: `${Date.now() - this.startTime}ms`,
          requestId: this.context?.requestId,
          timestamp: new Date().toISOString(),
          ...error.meta,
        },
      };
    }
  }

  async run() {
    throw new Error('Method not implemented');
  }
}