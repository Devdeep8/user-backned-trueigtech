import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AppError from "../utils/appError.js";
import dotenv from "dotenv";
dotenv.config();
class AuthService {
  async register(name, email, password, role = "user") {
    if (!name || !email || !password) {
      throw new AppError("Name, email and password are required", 400);
    }
    if (password.length < 6) {
      throw new AppError("Password must be at least 6 characters", 400);
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError("Email already registered", 409);
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate Refresh Token early to save with user creation
    // Note: We need a temporary ID context or we generate it afterwards.
    // Since generateRefreshToken needs userId, we actually have to create user first OR use UUIDs.
    // Assuming auto-increment or DB generated IDs, we stick to create-first but we can optimize the error handling.
    // However, if we want to be "fully correct" as requested, we should wrap this in a transaction if possible,
    // but without seeing the DB config, I will optimize the flow to be cleaner.

    // Actually, looking at the code, it uses `user.id` for token generation.
    // So we MUST create the user first to get the ID (unless we pre-generate UUID).
    // The current flow works but let's make it cleaner and ensuring we don't leave a user without a token if update fails.

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    if (!user) {
      throw new AppError("Failed to create user", 500);
    }

    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);
    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    // Update with tokens
    try {
      await user.update({
        refreshToken,
        refreshTokenExpiresAt,
      });
    } catch (err) {
      // If updating token fails, we should probably delete the user to avoid "half-created" state
      // or just throw error (user can try login to trigger new token generation if login has that logic,
      // but login usually just checks password).
      // Best approach for "fully correct": cleanup.
      await user.destroy();
      throw new AppError("Failed to generate initial tokens", 500);
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async login (email , password){
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid password", 401);
    }
    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);
    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );
    try {
      await user.update({
        refreshToken,
        refreshTokenExpiresAt,
      });
    } catch (err) {
      await user.destroy();
      throw new AppError("Failed to generate initial tokens", 500);
    }
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(oldRefreshToken) {
    if (!oldRefreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    // Find user
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Check token matches
    if (user.refreshToken !== oldRefreshToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    // Check expiry
    if (user.refreshTokenExpiresAt < new Date()) {
      throw new AppError("Refresh token expired", 401);
    }

    // Generate new tokens
    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    // Update refresh token
    try {
      await user.update({
        refreshToken,
        refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      await user.reload();
      if (!user.refreshToken) {
        throw new Error("Token not saved");
      }
    } catch (error) {
      console.error("Failed to update refresh token:", error.message);
      throw new AppError("Failed to refresh token", 500);
    }

    return { accessToken, refreshToken };
  }

  async logout(userId) {
    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    try {
      await user.update({
        refreshToken: null,
        refreshTokenExpiresAt: null,
      });
    } catch (error) {
      console.error("Failed to logout:", error.message);
      throw new AppError("Failed to logout", 500);
    }
  }

  generateAccessToken(userId, role) {
    return jwt.sign({ userId, role }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });
  }

  generateRefreshToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });
  }

  async me(userId) {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ["password", "refreshToken", "refreshTokenExpiresAt"],
      },
    });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }
}
export default new AuthService();
