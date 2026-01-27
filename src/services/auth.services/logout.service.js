import { BaseService } from "../base.service.js";

class LogoutService extends BaseService {
    async run( ) {
        const {userId} = this.args;
        try {
            const user = await this.db.user.findByPk(userId);
            if (!user) {
                throw new this.AppError("User not found", 404);
            }
            user.refreshToken = null;
            user.refreshTokenExpiresAt = null;
            await user.save();
            return {
                success: true,
                message: "User logged out successfully",
            };

        } catch (error) {
            throw error;
        }
    }
}
export default LogoutService;