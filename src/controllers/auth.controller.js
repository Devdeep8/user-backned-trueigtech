import authService from "../services/auth.service.js";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../utils/cookie.js";
class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;
      const result = await authService.register(name, email, password, role);

      setAccessTokenCookie(res, result.accessToken);
      setRefreshTokenCookie(res, result.refreshToken);
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req , res , next){
    const { email , password } = req.body;
    try {
      const result = await authService.login(email , password);
      setAccessTokenCookie(res , result.accessToken);
      setRefreshTokenCookie(res , result.refreshToken);
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      const tokens = await authService.refreshToken(refreshToken);

      setAccessTokenCookie(res, tokens.accessToken);
      setRefreshTokenCookie(res, tokens.refreshToken);

      res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          accessToken: tokens.accessToken,
        },
      });
    } catch (error) {
      next(error);
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
