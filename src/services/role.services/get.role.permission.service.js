import { BaseService } from "../base.service.js";

class GetRoleWithPermissionsService extends BaseService {
  async run() {
    const getRolesWithPermissions = await this.db.role.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt" , "description"],
      },
      include: [
        {
          model: this.db.permission,
          attributes: {
            exclude: ["createdAt", "updatedAt" , "description"],
          },
        },
      ],
    });
    if (!getRolesWithPermissions) {
      throw new this.error("Roles not found", this.httpStatus.NOT_FOUND);
    }
    return getRolesWithPermissions;
  }
}

export default GetRoleWithPermissionsService;
