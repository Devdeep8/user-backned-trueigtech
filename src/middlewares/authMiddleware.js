import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import userRepository from "../dbOperation/user.repository.js";
import { TokenService } from "../utils/token.service.js";
import { setAccessTokenCookie } from "../utils/cookie.js";
import { httpStatus } from "../helper/http-status.js";

const tokenService = new TokenService({
  ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_SECRET,
  REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_SECRET,
  ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL,
  TOKEN_ISSUER: process.env.TOKEN_ISSUER,
});

class AuthMiddleware {
  constructor() {
    this.authenticate = this.authenticate.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.isAdmin = this.isAdmin.bind(this);
    this.isPlayer = this.isPlayer.bind(this);
    this.authorize = this.authorize.bind(this);
  }

  // ===============================
  // MAIN AUTHENTICATION
  // ===============================
  async authenticate(req, res, next) {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;
    // (accessToken , "1");
    if (!refreshToken){
        return res.status(401).json({ message: "refresh token is not their" });
    }
    
    if (!accessToken) return this.handleRefresh(req, res, next);
    
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      if (decoded.typ !== "access") return this.handleRefresh(req, res, next);
      
      const user = await userRepository.getUserByIdentifier({
        id: decoded.userId,
      });
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      
      
      // Attach user from JWT
      req.user = {
        userId: user.id,
        role: user.role.name,
        name: user.name,
        email: user.email,
        permissions: user.role.permissions?.map((p) => p.key) || [],
      };



      
      // ("middleware 1 run")
      return next();
    } catch (err) {
      return this.handleRefresh(req, res, next);
    }
  }

  // ===============================
  // REFRESH HANDLER
  // ===============================
  async handleRefresh(req, res, next) {
    ("Start");
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      // 🔴 Return 401 instead of setting req.user = null
      return res.status(401).json({ message: "No refresh token provided" });
    }

    try {
      const decodedRefresh = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
      );

      if (decodedRefresh.typ !== "refresh") {
        // 🔴 Return 401 for invalid token type
        return res.status(401).json({ message: "Invalid token type" });
      }

      // Fetch user only to get permissions
      const user = await userRepository.getUserByIdentifier({
        id: decodedRefresh.userId,
      });

      if (!user) {
        // 🔴 Return 401 if user not found
        return res.status(401).json({ message: "User not found" });
      }

      if (user.refreshToken !== refreshToken) {
        // 🔴 Return 401 for token mismatch
        throw new AppError("Refresh does not match with Db" , httpStatus.UNAUTHORIZED , {type: "login in another browser"} , "authmiddleware")
      }


      // Rotate access token
      const newAccessToken = tokenService.createAccessToken({
        userId: user.id,
        role: user.role.name,
      });
      setAccessTokenCookie(res, newAccessToken);

      // Attach full user with permissions
      req.user = {
        userId: user.id,
        role: user.role.name,
        name: user.name,
        email: user.email,
        permissions: user.role.permissions?.map((p) => p.key) || [],
      };


      return next();
    } catch (err) {
      // 🔴 Return 401 for any JWT verification errors
      next(err)
    }
  }

  // ===============================
  // ROLE CHECKS
  // ===============================
  isAdmin(req, res, next) {
    if (req.user?.role !== "super_admin")
      return next(new AppError("Admin access required", 403));
    next();
  }

  isPlayer(req, res, next) {
    if (req.user?.role !== "user")
      return next(new AppError("Player access required", 403));
    next();
  }

  // ===============================
  // PERMISSION CHECK
  // ===============================
  authorize({ roles = [], permissions = [] }) {
    return (req, res, next) => {
      if (!req.user) return next(new AppError("Unauthorized", 401));

      const userPerms = Array.isArray(req.user.permissions)
        ? req.user.permissions
        : [];

      if (roles.length && !roles.includes(req.user.role))
        return next(new AppError("You do not have the required role", 403));

      if (
        permissions.length &&
        !permissions.every((p) => userPerms.includes(p))
      )
        return next(
          new AppError("You do not have the required permission", 403),
        );

      next();
    };
  }
}

export default new AuthMiddleware();
