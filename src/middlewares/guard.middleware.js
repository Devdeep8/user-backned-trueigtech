// middleware/validation.middleware.js
import AppError from "../utils/appError.js";
import { httpStatus } from "../helper/http-status.js";
import ajv from "../config/ajv.js";
/**
 * Generic validation middleware factory
 * Accepts schema and options from router
 */
export const validateRequest = (schema, options = {}) => {
  // Compile schema once when middleware is created
  const validateSchema = ajv.compile(schema);

  // Return the actual middleware function
  return async (req, res, next) => {
    try {

      // Step 1: Wrap data if enabled and not already wrapped
      if (options.wrapData && req.body && !req.body.data) {
        req.body = { data: req.body };
      }

      // Step 2: Validate schema
      const valid = validateSchema(req.body);

      if (!valid) {
        const errorMessages = validateSchema.errors.map(err => {
          const field = err.instancePath.replace(/^\//, '').replace(/\//g, '.') || err.params.missingProperty;
          return `${field}: ${err.message}`;
        });

        const validationError = new AppError(
          errorMessages.join(', '),
          httpStatus.BAD_REQUEST,
        );

        validationError.details = validateSchema.errors;
        req.validationError = validationError;
        return next();
      }

      // Step 3: Check if record exists (if checkExists option provided)

      // All checks passed!
      next();

    } catch (error) {
      req.validationError = new AppError(
        error.message,
        httpStatus.BAD_REQUEST,
        'VALIDATION_CHECK_ERROR'
      );
      next();
    }
  };
};