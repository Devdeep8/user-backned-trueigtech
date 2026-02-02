import { ttlToMs } from "../../utils/cookie.js";
import { TokenService } from "../../utils/token.service.js";
import { BaseService } from "../base.service.js";

class RefreshService extends BaseService {
    async run() {
        const {token} = this.args
        const { config } = this.context;
        
       
            const user = await this.db.user.findOne({
                where: { refreshToken : token },
                include: [
                    {
                        model: this.db.role,
                        as: "role",
                        attributes: ["name"],
                    },
                ],
            });
            if (!user) {
                throw new this.AppError("User not found", 404);
            }
            if (user.refreshToken !== token) {
                throw new this.AppError("Invalid refresh token", 401);
            }
            if (user.refreshTokenExpiresAt < new Date()) {
                throw new this.AppError("Refresh token expired", 401);
            }

            const tokenService = new TokenService(config);
            const payload = {
                userId: user.id,
                role: user.role.name,
            };
            
            const accessToken = tokenService.createAccessToken(payload);
            const refreshToken = tokenService.createRefreshToken(payload);
            user.refreshToken = refreshToken;
            user.refreshTokenExpiresAt = new Date(Date.now() + ttlToMs(config.REFRESH_TOKEN_TTL));
            await user.save();
            return { accessToken, refreshToken };
       
    }
}

export default RefreshService;
