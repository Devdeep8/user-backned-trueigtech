// src/middlewares/reqMiddleware.js
import { httpStatus } from "../helper/http-status.js";
import { db } from "../model/index.js";
import AppError from "../utils/appError.js";
const reqMiddleware = async (req, res, next) => {
  try {
    // ------------------------
    // 0️⃣ DB / Internet Check
    // ------------------------
    try {
      // Simple DB ping
      await db.sequelize.authenticate();
    } catch (err) {
      throw new AppError("Database unreachable / Internet issue" , httpStatus.INTERNAL_SERVER_ERROR , {type: "internet"} , "req")
    }

    // ------------------------
    // 1️⃣ Body & Content-Type checks (optional if needed)
    // ------------------------
    const METHODS_WITH_BODY = ["POST", "PUT", "PATCH", "DELETE"];
    if (METHODS_WITH_BODY.includes(req.method)) {
      const contentType = req.headers["content-type"];
      if (!contentType || !contentType.includes("application/json")) {
        const error = new AppError("Content-Type must be application/json" , httpStatus.CONTENT_TYPE);
   
        throw error;
      }
 
      if (!req.body || Object.keys(req.body).length === 0) {
        const error = new AppError("Request body is required" , httpStatus.BAD_REQUEST);
        throw error;
      }
    }

    // ✅ DB is healthy, body is okay → continue
    next();
  } catch (err) {
    next(err); // central error handler will send the response
  }
};

export default reqMiddleware;
