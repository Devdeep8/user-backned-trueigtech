import CreateRoleService from "../services/role.services/create.role.service.js";
import GetRoleService from "../services/role.services/get.role.service.js";
import UpdateRoleService from "../services/role.services/update.role.service.js";
import GetRoleWithPermissionsService from "../services/role.services/get.role.permission.service.js";
import AddRolePermissionService from "../services/role.services/add.role.permission.service.js";
import RemoveRolePermissionService from "../services/role.services/remove.role.permission.service.js";
import { httpStatus } from "../helper/http-status.js";

class RoleController {
  async getAllRoles(req, res, next) {
    try {
      const getRoleService = new GetRoleService(
        {},
        { user: req.user, requestId: req.requestId },
      );
      const result = await getRoleService.execute();
      return getRoleService.sendResponse(
        res,
        result,
        "Roles retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async createRole(req, res, next) {
    try {
      const createRoleService = new CreateRoleService(
        { data: req.body },
        { user: req.user, requestId: req.requestId },
      );
      const result = await createRoleService.execute();
      return createRoleService.sendResponse(
        res,
        result,
        "Role created successfully",
        httpStatus.CREATED,
      );
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req, res, next) {
    try {
      const updateRoleService = new UpdateRoleService(
        { id: req.params.id, data: req.body },
        { user: req.user, requestId: req.requestId },
      );
      const result = await updateRoleService.execute();
      return updateRoleService.sendResponse(
        res,
        result,
        "Role updated successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async roleWithPermissions(req, res, next) {
    try {
      const service = new GetRoleWithPermissionsService(
        {},
        { user: req.user, requestId: req.requestId },
      );
      const result = await service.execute();
      return service.sendResponse(
        res,
        result,
        "Roles with permissions retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async createRolePermission(req, res, next) {
    const { roleId } = req.params;
    const { permissionId } = req.body;
    try {
      const service = new AddRolePermissionService(
        { roleId, permissionId },
        { user: req.user, requestId: req.requestId },
      );
      const result = await service.execute();
      return service.sendResponse(
        res,
        result,
        "Role permission created successfully",
        httpStatus.CREATED,
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteRolePermission(req, res, next) {
    const { roleId, permissionId } = req.params;
    try {
      const service = new RemoveRolePermissionService(
        { roleId, permissionId },
        { user: req.user, requestId: req.requestId },
      );
      const result = await service.execute();
      return service.sendResponse(
        res,
        result,
        "Role permission deleted successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async createRoleWithPermsisson(req, res, next) {
    const { data, permissions } = req.body;
    try {
      // 1. Create Role
      const createRoleService = new CreateRoleService(
        { data },
        { user: req.user, requestId: req.requestId },
      );
      // We need to run it directly to get the ID, or use execute and check success.
      // Using execute() returns a result object with .data, .success, etc.
      const roleResult = await createRoleService.execute();

      if (!roleResult.success) {
        // If generic error handler in BaseService didn't throw (it returns error response),
        // we need to return it here.
        return createRoleService.sendResponse(res, roleResult);
      }

      const role = roleResult.data; // The created role

      // 2. Add Permissions
      // We can iterate and call AddRolePermissionService.
      // Note: Ideally this should be a Transaction. BaseService doesn't seem to expose transaction logic easily
      // unless we pass it. For now, we'll do it sequentially/parallel as requested by logic.

      // We'll reuse the context.
      const results = await Promise.all(
        permissions.map((permissionId) => {
          const service = new AddRolePermissionService(
            { roleId: role.id, permissionId },
            { user: req.user, requestId: req.requestId },
          );
          return service.execute();
        }),
      );

      // Check for failures? For now, we assume success or partial success.
      // The original code didn't handle partial failure explicitly other than throwing error if promise rejected.

      return createRoleService.sendResponse(
        res,
        {
          success: true,
          data: { role, permissionsResults: results.map((r) => r.success) },
        }, // Constructing a custom result for response
        "Role created with permissions successfully",
        httpStatus.CREATED,
      );
    } catch (error) {
      next(error);
    }
  }
}
export default new RoleController();
