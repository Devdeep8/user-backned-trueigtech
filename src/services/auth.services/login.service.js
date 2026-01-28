// login.service.js
import { ttlToMs } from "../../utils/cookie.js";
import { TokenService } from "../../utils/token.service.js";
import { BaseService } from "../base.service.js";
import bcrypt from "bcryptjs";

class LoginService extends BaseService {
  async run() {
    const { email, password } = this.args;
    const { 
      ACCESS_TOKEN_SECRET, 
      REFRESH_TOKEN_SECRET, 
      ACCESS_TOKEN_TTL, 
      REFRESH_TOKEN_TTL, 
      TOKEN_ISSUER, 
      requestId 
    } = this.context;

    const config = {
      ACCESS_TOKEN_SECRET,
      REFRESH_TOKEN_SECRET,
      ACCESS_TOKEN_TTL,
      REFRESH_TOKEN_TTL,
      TOKEN_ISSUER,
      requestId,
    };

    // Validation
    if (!email) {
      throw new this.error("Email is required", 400);
    }
    if (!password) {
      throw new this.error("Password is required", 400);
    }

    // Find user
    const user = await this.db.user.findOne({
      where: { email },
      include: [
        {
          model: this.db.role,
          as: "userRole",
          include: [
            {
              model: this.db.permission,
              as: "permissions",
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!user) {
      throw new this.error("User not found", 404);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new this.error("Invalid password", 401);
    }

    // Generate tokens
    const tokenService = new TokenService(config);
    const payload = {
      userId: user.id,
      role: user.userRole.name,
    };

    const accessToken = tokenService.createAccessToken(payload);
    const refreshToken = tokenService.createRefreshToken(payload);

    // Update user refresh token
    user.refreshToken = refreshToken;
    user.refreshTokenExpiresAt = new Date(
      Date.now() + ttlToMs(config.REFRESH_TOKEN_TTL)
    );
    await user.save();

    // Return data matching controller expectations
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.userRole.name,
      },
      accessToken,
      refreshToken,
    };
  }
}

export default LoginService;