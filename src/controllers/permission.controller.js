import CreatePermissionService from "../services/permission.services/create.permission.service.js";
import DeletePermissionService from "../services/permission.services/delete.permission.service.js";
import GetPermissionByIdService from "../services/permission.services/get.permission.by.id.service.js";
import GetPermissionService from "../services/permission.services/get.permission.service.js";
import GroupPermissionService from "../services/permission.services/group.permission.service.js";
import UpdatePermissionService from "../services/permission.services/update.permission.service.js";
import { httpStatus } from "../helper/http-status.js";

class PermissionController {
  async getAllPermissions(req, res, next) {
    try {
      const getPermissionService = new GetPermissionService(
        {},
        { user: req.user, requestId: req.requestId },
      );
      const result = await getPermissionService.execute();
      return res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error);
    }
  }

  async getPermissionById(req, res, next) {
    const id = req.params.id;
    try {
      const service = new GetPermissionByIdService(
        { id },
        { user: req.user, requestId: req.requestId },
      );
      const result = await service.execute();
      return service.sendResponse(
        res,
        result,
        "Permission fetched successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async createPermission(req, res, next) {
    const data = req.body;
    try {
      const service = new CreatePermissionService(
        { data },
        { user: req.user, requestId: req.requestId },
      );
      const result = await service.execute();
      return service.sendResponse(
        res,
        result,
        "Permission created successfully",
        httpStatus.CREATED,
      );
    } catch (error) {
      next(error);
    }
  }

  async updatePermission(req, res, next) {
    const id = req.params.id;
    const data = req.body;
    try {
      const service = new UpdatePermissionService(
        { id, data },
        { user: req.user, requestId: req.requestId },
      );
      const result = await service.execute();
      return service.sendResponse(
        res,
        result,
        "Permission updated successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async deletePermission(req, res, next) {
    const id = req.params.id;
    try {
      const service = new DeletePermissionService(
        { id },
        { user: req.user, requestId: req.requestId },
      );
      const result = await service.execute();
      return service.sendResponse(
        res,
        result,
        "Permission deleted successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async groupPermission(req, res, next) {
    try {
      const service = new GroupPermissionService(
        {},
        { user: req.user, requestId: req.requestId },
      );
      const result = await service.execute();
      return res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error);
    }
  }
}

export default new PermissionController();
