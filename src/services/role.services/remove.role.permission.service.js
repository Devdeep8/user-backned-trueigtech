import { BaseService } from "../base.service.js";
import RolePermissionRepository from "../../dbOperation/role.premission.js";

class RemoveRolePermissionService extends BaseService {
  async run() {
    const { roleId, permissionId } = this.args;

    if (!roleId || !permissionId) {
      throw new this.error("Invalid data", this.httpStatus.BAD_REQUEST);
    }
    const rolePermission =
      await RolePermissionRepository.deleteRoleAndPermission({
        roleId,
        permissionId,
      });
    if (!rolePermission) {
      throw new this.error(
        "Role permission not deleted",
        this.httpStatus.NOT_FOUND,
      );
    }
    return rolePermission;
  }
}

export default RemoveRolePermissionService;
