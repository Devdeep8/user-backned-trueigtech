import authService from "../services/auth.service.js";
import LoginService from "../services/auth.services/login.service.js";
import AppError from "../utils/appError.js";
import db from "../model/db.js";
import {
  clearAuthCookies,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../utils/cookie.js";
class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register(name, email, password);

      setAccessTokenCookie(res, result.accessToken);
      setRefreshTokenCookie(res, result.refreshToken);
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const config = {
      ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_SECRET,
      REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_SECRET,
      ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL,
      REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL,
      TOKEN_ISSUER: process.env.TOKEN_ISSUER,
    };
    try {
      const loginService = new LoginService(
        AppError,
        { email, password },
        { config },
        db,
      );
      const result = await loginService.run();
      setAccessTokenCookie(res, result.accessToken);
      setRefreshTokenCookie(res, result.refreshToken);
      // const result = await authService.login(email, password);

      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;

      // If no refresh token at all → logout immediately
      if (!refreshToken) {
        clearAuthCookies(res);
        return res.status(401).json({
          success: false,
          message: "Refresh token missing",
        });
      }

      const tokens = await authService.refreshToken(refreshToken);

      // Rotate tokens
      setAccessTokenCookie(res, tokens.accessToken);
      setRefreshTokenCookie(res, tokens.refreshToken);

      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
      });
    } catch (error) {
      // 🔥 CRITICAL FIX: clear cookies on ANY refresh failure
      clearAuthCookies(res);

      // Optional: normalize error
      return res.status(401).json({
        success: false,
        message: "Session expired, please login again",
      });
    }
  }

  async logout(req, res, next) {
    try {
      await authService.logout(req.user.userId);

      res.cookie("refreshToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth/refresh", // must match original path
        maxAge: 0, // delete immediately
      });

      res.cookie("accessToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0, // delete immediately
      });

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  async me(req, res) {
    const user = await authService.me(req.user.userId);
    res.json({
      success: true,
      message: "User retrieved successfully",
      data: {
        user,
      },
    });
  }
}
export default new AuthController();
