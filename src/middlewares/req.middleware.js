// src/middlewares/reqMiddleware.js
import { httpStatus } from "../helper/http-status.js";
import db from "../model/db.js";
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
        const error = new Error("Content-Type must be application/json");
        error.status = 415;
        throw error;
      }
 
      if (!req.body || Object.keys(req.body).length === 0) {
        const error = new Error("Request body is required");
        error.status = 400;
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
