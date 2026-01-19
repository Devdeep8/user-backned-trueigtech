// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import { User } from "../model/user.model.js";

class AuthMiddleware {
  async authenticate(req, res, next) {
    try {
      // 🔥 Read token from cookies (NOT headers)
      const token = req.cookies.accessToken;

      if (!token) {
        throw new AppError("Unauthorized", 401);
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      // INSTANT CHECK: Validate against DB
      const user = await User.findByPk(decoded.userId);

      if (!user) {
        throw new AppError("User no longer exists", 401);
      }

      if (!user.isActive) {
        throw new AppError("User account is suspended", 401);
      }

      // Optional: Check if role changed
      if (user.role !== decoded.role) {
        // Role changed, force refresh to get new token
        throw new AppError("Role changed, please login again", 401);
      }

      // Attach user to request
      req.user = {
        userId: user.id,
        role: user.role,
        email: user.email,
      };

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
