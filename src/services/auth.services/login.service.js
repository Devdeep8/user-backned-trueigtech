import { TokenService } from "../../utils/token.service.js";
import { BaseService } from "../base.service.js";
import bcrypt from "bcryptjs";
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

    return { accessToken, refreshToken };
  }
}

export default LoginService;
