import LoginService from "../services/auth.services/login.service.js";

import {
  clearAuthCookies,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../utils/cookie.js";
import RegisterService from "../services/auth.services/register.service.js";
import LogoutService from "../services/auth.services/logout.service.js";
import CurrnetUserService from "../services/auth.services/me.service.js";
import RefreshService from "../services/auth.services/refresh.service.js";
import { httpStatus } from "../helper/http-status.js";
class AuthController {
  async register(req, res, next) {
    const { name, email, password } = req.body;
    const config = {
      ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_SECRET,
      REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_SECRET,
      ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL,
      REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL,
      TOKEN_ISSUER: process.env.TOKEN_ISSUER,
    };
    try {
      const registerService = new RegisterService(
        { name, email, password },
        { config },
      );
      const result = await registerService.run();
      // const result = await authService.register(name, email, password);

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
  // auth.controller.js
  async login(req, res, next) {
    const { email, password } = req.body;

    const loginService = new LoginService(
      { email, password },
      {
        ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_SECRET,
        REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_SECRET,
        ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL,
        REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL,
        TOKEN_ISSUER: process.env.TOKEN_ISSUER,
        requestId: req.requestId,
      },
    );

    const result = await loginService.execute();

    // Handle success response
    setAccessTokenCookie(res, result.data.accessToken);
    setRefreshTokenCookie(res, result.data.refreshToken);
    return res.status(200).json({ ...result });
  }

  async refresh(req, res, next) {
    const refreshToken = req.cookies.refreshToken;
    const config = {
      ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_SECRET,
      REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_SECRET,
      ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL,
      REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL,
      TOKEN_ISSUER: process.env.TOKEN_ISSUER,
    };
    try {
      // If no refresh token at all → logout immediately
      if (!refreshToken) {
        clearAuthCookies(res);
        return res.status(401).json({
          success: false,
          message: "Refresh token missing",
        });
      }

      const refreshService = new RefreshService(
        { token: refreshToken },
        { config },
      );
      const tokens = await refreshService.run();

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
      const logoutService = new LogoutService(
        { userId: req.user.userId },
        { res },
      );
      await logoutService.run();
      clearAuthCookies(res);

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  async me(req, res) {
    const currnetUserService = new CurrnetUserService(
      { userId: req.user.userId },
      { res },
    );
    const result = await currnetUserService.execute();
    return res.status(httpStatus.OK).json(result)
  }
}
export default new AuthController();
