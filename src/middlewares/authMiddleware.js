// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

class AuthMiddleware {
  authenticate(req, res, next) {
    try {
      // 🔥 Read token from cookies (NOT headers)
      const token = req.cookies.accessToken;
      console.log(token);

      if (!token) {
        throw new AppError("Unauthorized", 401);
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      req.user = {
        userId: decoded.userId,
        role: decoded.role,
      };

      console.log(req.user);

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return next(new AppError("Access token expired", 401));
      }

      next(new AppError("Invalid access token", 401));
    }
  }

  isAdmin(req, res, next) {
    if (req.user.role !== "admin") {
      return next(new AppError("Admin access required", 403));
    }
    next();
  }

  isPlayer(req, res, next) {
    if (req.user.role !== "user") {
      return next(new AppError("Player access required", 403));
    }
    next();
  }
}

export default new AuthMiddleware();
