import { BaseService } from "../base.service.js";
import RolePermissionRepository from "../../dbOperation/role.premission.js";

class AddRolePermissionService extends BaseService {
  async run() {
    const { roleId, permissionId } = this.args;

    if (!roleId || !permissionId) {
      throw new this.error("Invalid data", this.httpStatus.BAD_REQUEST);
    }
    const rolePermission =
      await RolePermissionRepository.createRoleAndPermission(
        roleId,
        permissionId,
      );
    if (!rolePermission) {
      throw new this.error(
        "Role permission not created",
        this.httpStatus.NOT_FOUND,
      ); // 404 in original
    }
    return rolePermission;
  }
}

export default AddRolePermissionService;
