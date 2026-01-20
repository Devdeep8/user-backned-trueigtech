import roleRepository from "../dbOperation/role.repository.js";
import AppError from "../utils/appError.js";
import RolePermissionRepository from "../dbOperation/role.premission.js";

const ROLE_HIERARCHY = {
  super_admin: 4,
  admin: 3,
  manager: 2,
  staff: 1,
  user: 0,
};

class RoleService {
  async getAllRoles() {
    const allRoles = await roleRepository.getAllRoles();
    if (!allRoles || !allRoles.length) {
      throw new AppError("Roles not found", 404);
    }
    return allRoles;
  }

  async createRole(data, requesterRole) {
    if (!data) {
      throw new AppError("Invalid data", 400);
    }

    // Hierarchy Check
    const requesterRank = ROLE_HIERARCHY[requesterRole] || 0;
    // Default new roles to 0 (user) unless specified, but names matter.
    // If creating a known high-level role, check rank.
    // Assuming data.name is the role name being created.
    const targetRank = ROLE_HIERARCHY[data.name] || 0;

    if (requesterRank < targetRank) {
      throw new AppError("You cannot create a role higher than your own", 403);
    }
    // Also, usually users can't create roles EQUAL to themselves to avoid clones,
    // unless they are super_admin.
    if (requesterRole !== "super_admin" && requesterRank <= targetRank) {
      // Strict hierarchy: Admin creates Manager, but Admin cannot create Admin.
      // Adjust based on preference.
      throw new AppError(
        "You cannot create a role equal to or higher than your own",
        403,
      );
    }

    const role = await roleRepository.getRoleByIdentifier({ name: data.name });
    if (role) {
      throw new AppError("Role already exists", 409);
    }

    return await roleRepository.createRole(data);
  }

  async updateRole(id, data) {
    if (!id || !data) {
      throw new AppError("Invalid data", 400);
    }
    const role = await roleRepository.getRoleByIdentifier({ name: data.name });
    if (!role) {
      throw new AppError("Role not found", 404);
    }
    return await roleRepository.updateRole(id, data);
  }

  async roleWithPermissions() {
    try {
      const getRolesWithPermissions =
        await roleRepository.roleWithPermissions();
      if (!getRolesWithPermissions) {
        throw new AppError("Roles not found", 404);
      }
      return getRolesWithPermissions;
    } catch (error) {
      throw error;
    }
  }

  async createRolePermission(roleId, permissionId) {
    if (!roleId || !permissionId) {
      throw new AppError("Invalid data", 400);
    }
    const rolePermission =
      await RolePermissionRepository.createRoleAndPermission(
        roleId,
        permissionId,
      );
    if (!rolePermission) {
      throw new AppError("Role permission not created", 404);
    }
    return rolePermission;
  }

  async deleteRolePermission(roleId, permissionId) {
    if (!roleId || !permissionId) {
      throw new AppError("Invalid data", 400);
    }
    const rolePermission =
      await RolePermissionRepository.deleteRoleAndPermission({
        roleId,
        permissionId,
      });
    if (!rolePermission) {
      throw new AppError("Role permission not deleted", 404);
    }
    return rolePermission;
  }
}
export default new RoleService();
