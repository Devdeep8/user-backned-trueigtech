import { BaseService } from "../base.service.js";

class CurrnetUserService extends BaseService {
  async run() {
    const { userId } = this.args;
    try {
      const user = await this.db.user.findByPk(userId, {
        attributes: ["id", "name", "email", "isActive"],
        include: [
          {
            model: this.db.role,
            as: "userRole",
            attributes: ["id", "name"],
            include: [
              {
                model: this.db.permission,
                as: "permissions",
                attributes: ["id", "key"], // only permission id & key

                through: { attributes: [] },
              },
            ],
          },
        ],
      });
      if (!user) {
        throw new this.AppError("User not found", 404);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
export default CurrnetUserService;
