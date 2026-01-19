import { RolePermission } from "../model/rolepermissions.model.js";
class RolePermissionRepository {
  async createRoleAndPermission(roleId, permissionId) {
    const rolePermission = await RolePermission.create({
      roleId: roleId,
      permissionId: permissionId,
    });
    return rolePermission;
  }

  async deleteRoleAndPermission({ roleId, permissionId }) {
    const where = { roleId, permissionId };

    const deletedCount = await RolePermission.destroy({ where });

    return deletedCount; // returns number of rows deleted
  }
}
export default new RolePermissionRepository();
