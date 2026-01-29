// middleware/validation.middleware.js
import AppError from "../utils/appError.js";
import { httpStatus } from "../helper/http-status.js";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import ajvErrors from "ajv-errors";

// Create AJV instance
const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
});

addFormats(ajv);
ajvErrors(ajv);

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
        const errorMessages = validateSchema.errors.map((err) => {
          const field =
            err.instancePath.replace(/^\//, "").replace(/\//g, ".") ||
            err.params.missingProperty;
          return `${field}: ${err.message}`;
        });

        // Pass details in meta so toJSON() includes it
        const validationError = new AppError(
          errorMessages.join(", "),
          httpStatus.BAD_REQUEST,
          {
            type: "VALIDATION_ERROR",
            code: "VALIDATION_ERROR",
            meta: { details: validateSchema.errors },
          },
        );

        // ✅ Halt execution and send response
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(validationError.toJSON());
      }

      // Step 3: Check if record exists (if checkExists option provided)

      // All checks passed!
      next();
    } catch (error) {
      const appError = new AppError(
        error.message || "Validation check failed",
        httpStatus.BAD_REQUEST,
        {
          type: "VALIDATION_CHECK_ERROR",
          code: "VALIDATION_CHECK_ERROR",
        },
      );
      return res.status(httpStatus.BAD_REQUEST).json(appError.toJSON());
    }
  };
};
