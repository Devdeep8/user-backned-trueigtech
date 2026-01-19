import { User, Role } from "../model/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AppError from "../utils/appError.js";
import dotenv from "dotenv";
import userRepository from "../dbOperation/user.repository.js";
import roleRepository from "../dbOperation/role.repository.js";
dotenv.config();
class AuthService {
  async register(name, email, password) {
    if (!name || !email || !password) {
      throw new AppError("Name, email and password are required", 400);
    }

    if (password.length < 6) {
      throw new AppError("Password must be at least 6 characters", 400);
    }

    const existingUser = await userRepository.getUserByIdentifier({email});
    if (existingUser) {
      throw new AppError("Email already registered", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ STEP 1: Check total users
    const userCount = await User.count();

    // ✅ STEP 2: Decide role name
    const roleName = userCount === 0 ? "admin" : "user";

    // ✅ STEP 3: Fetch role from DB
  const roleRecord = await roleRepository.getRoleByIdentifier({name : roleName})

    if (!roleRecord) {
      throw new AppError(`Role '${roleName}' not found`, 500);
    }

    // ✅ STEP 4: Create user
    const user = await userRepository.createUser({
      name,
      email,
      password: hashedPassword,

      // legacy enum (keep for now)
      role: roleName,

      // RBAC system
      roleId: roleRecord.id,
    });

    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    );

    await user.update({
      refreshToken,
      refreshTokenExpiresAt,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.userRole.name,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(email, password) {

    const user = await userRepository.getUserByIdentifier({email})
    
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid password", 401);
    }
    const accessToken = this.generateAccessToken(user.id, user.userRole.name);
    const refreshToken = this.generateRefreshToken(user.id);
    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
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
        role: user.userRole.name,
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
    const user = await userRepository.getUserByIdentifier({id : decoded.userId})
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
    const accessToken = this.generateAccessToken(user.id, user.userRole.name);
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

    const user = await userRepository.getUserByIdentifier({id : userId});
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
      expiresIn: "10m",
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
