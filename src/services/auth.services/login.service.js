import { TokenService } from "../../utils/token.service.js";
import { BaseService } from "../base.service.js";
import bcrypt from "bcryptjs";

function ttlToMs(ttl) {
  const unit = ttl.slice(-1); // last character: d, h, m, s
  const value = parseInt(ttl.slice(0, -1)); // number part

  switch (unit) {
    case 'd':
      return value * 24 * 60 * 60 * 1000; // days to ms
    case 'h':
      return value * 60 * 60 * 1000; // hours to ms
    case 'm':
      return value * 60 * 1000; // minutes to ms
    case 's':
      return value * 1000; // seconds to ms
    default:
      throw new Error('Invalid TTL format');
  }
}
class LoginService extends BaseService {
  async run() {
    const { email, password } = this.args;
    const { config } = this.context;

    if (!email) {
      throw new this.error("Email is required", 400);
    }
    if (!password) {
      throw new this.error("Password is required", 400);
    }

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

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new this.error("Invalid password", 401);
    }

    const tokenService = new TokenService(config);
    const payload = {
      userId: user.id,
      role: user.userRole.name,
    };

    const accessToken = tokenService.createAccessToken(payload);
    const refreshToken = tokenService.createRefreshToken(payload);

    user.refreshToken = refreshToken;
    user.refreshTokenExpiresAt = new Date(Date.now() + ttlToMs(config.REFRESH_TOKEN_TTL));
    await user.save();
    return { accessToken, refreshToken };
  }
}

export default LoginService;
