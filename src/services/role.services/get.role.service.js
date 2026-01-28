import { BaseService } from "../base.service.js";

class GetRoleService extends BaseService {
  async run() {
    const allRoles = await this.db.role.findAll({
      include: [
        {
          model: this.db.permission,
          attributes: {
            exclude: ["createdAt", "updatedAt" , "description"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt" , "description"],
      },
    });
    if (!allRoles || !allRoles.length) {
      throw new this.error("Roles not found", this.httpStatus.NOT_FOUND);
    }
    return allRoles;
  }
}

export default GetRoleService;
