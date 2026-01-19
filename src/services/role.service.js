import roleRepository from "../dbOperation/role.repository.js";
import AppError from "../utils/appError.js";
import RolePermissionRepository from "../dbOperation/role.premission.js";

class RoleService {
  async getAllRoles() {
    return await roleRepository.getAllRoles();
  }

  async createRole(data) {
    if (!data) {
      throw new AppError("Invalid data", 400);
    }
    const role = await roleRepository.getRoleByIdentifier({ name: data.name });
    if (role) {
      throw new AppError("Role already exists", 409);
    }

    return await roleRepository.createRole(data);
  }

  async updateRole(id,data){
    if (!id || !data) {
      throw new AppError("Invalid data", 400);
    }
    const role = await roleRepository.getRoleByIdentifier({ name: data.name });
    if (!role) {
      throw new AppError("Role not found", 404);
    }
    return await roleRepository.updateRole(id,data);
  }

  async roleWithPermissions(){
    try {
      const getRolesWithPermissions =  await roleRepository.roleWithPermissions();
      if (!getRolesWithPermissions){
        throw new AppError("Roles not found", 404);
      }
      return getRolesWithPermissions;
    } catch (error) {
      throw error;
    }
  }

  async createRolePermission(roleId , permissionId){
    if (!roleId || !permissionId) {
      throw new AppError("Invalid data", 400);
    }
    const rolePermission = await RolePermissionRepository.createRoleAndPermission(roleId , permissionId);
    if (!rolePermission){
      throw new AppError("Role permission not created", 404);
    }
    return rolePermission;
  }

  async deleteRolePermission(roleId , permissionId){
    if (!roleId || !permissionId) {
      throw new AppError("Invalid data", 400);
    }
    const rolePermission = await RolePermissionRepository.deleteRoleAndPermission({ roleId , permissionId });
    if (!rolePermission){
      throw new AppError("Role permission not deleted", 404);
    }
    return rolePermission;
  }
}
export default new RoleService();
