// utils/errorLogger.js

export class ErrorLogger {
  static log(errorInfo) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: errorInfo.level.toUpperCase(),
      type: 'SERVICE_ERROR',
      
      service: {
        name: errorInfo.serviceName,
        executionTime: errorInfo.executionTime,
      },
      
      error: {
        name: errorInfo.error.name,
        message: errorInfo.error.message,
        code: errorInfo.error.code,
        type: errorInfo.error.type,
        httpStatus: errorInfo.error.httpStatus,
        stack: this.formatStack(errorInfo.error.stack),
      },
      
      request: {
        id: errorInfo.context?.requestId,
        userId: errorInfo.context?.userId,
        ip: errorInfo.context?.ip,
      },
      
      input: this.sanitizeInput(errorInfo.input),
      
      meta: {
        retryable: errorInfo.retryable,
        alertTeam: errorInfo.alertTeam,
        environment: process.env.NODE_ENV,
      },
    };
    
    if (process.env.NODE_ENV === 'development') {
      this.logDevelopment(logEntry);
    } else {
      console.error(JSON.stringify(logEntry));
    }
  }

  static logDevelopment(logEntry) {
    const emoji = { critical: '🔴', error: '🟠', warning: '🟡', info: '🔵' };
    
    console.error('\n' + '═'.repeat(80));
    console.error(`${emoji[logEntry.level.toLowerCase()] || '⚫'} ${logEntry.level} in ${logEntry.service.name}`);
    console.error('═'.repeat(80));
    console.error(`📅 Time:           ${logEntry.timestamp}`);
    console.error(`🆔 Request ID:     ${logEntry.request.id || 'N/A'}`);
    console.error(`👤 User ID:        ${logEntry.request.userId || 'Anonymous'}`);
    console.error(`⏱️  Execution:      ${logEntry.service.executionTime}`);
    console.error('─'.repeat(80));
    console.error(`📌 Type:           ${logEntry.error.type}`);
    console.error(`📛 Name:           ${logEntry.error.name}`);
    console.error(`💬 Message:        ${logEntry.error.message}`);
    console.error(`🔢 HTTP Status:    ${logEntry.error.httpStatus}`);
    console.error(`🏷️  Code:           ${logEntry.error.code}`);
    console.error(`🔄 Retryable:      ${logEntry.meta.retryable ? 'Yes ✅' : 'No ❌'}`);
    console.error('─'.repeat(80));
    console.error('📦 Input:');
    console.error(JSON.stringify(logEntry.input, null, 2));
    console.error('─'.repeat(80));
    console.error('📚 Stack:');
    console.error(logEntry.error.stack);
    console.error('═'.repeat(80) + '\n');
  }

  static info(infoData) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      type: infoData.type,
      service: infoData.serviceName,
      message: infoData.message,
      executionTime: infoData.executionTime,
      requestId: infoData.requestId,
      userId: infoData.userId,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('\n✅ SUCCESS:', logEntry.message);
      console.log(`   Service: ${logEntry.service}`);
      console.log(`   Time: ${logEntry.executionTime}\n`);
    } else {
      console.log(JSON.stringify(logEntry));
    }
  }

  static sanitizeInput(input) {
    if (!input || typeof input !== 'object') return input;

    const sensitiveFields = ['password', 'token', 'secret', 'apikey', 'cvv', 'ssn'];
    const sanitized = { ...input };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  static formatStack(stack) {
    if (!stack) return 'No stack trace';
    
    if (process.env.NODE_ENV === 'production') {
      return stack.split('\n').slice(0, 3).join('\n') + '\n... (truncated)';
    }
    
    return stack;
  }
}