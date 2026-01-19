import permissionService from "../services/permission.service.js";

class PermissionController {
  async getAllPermissions(req , res , next) {
    try {
      const permission =  await permissionService.getAllPermissions();
      return res.status(200).json({
        success: true,
        message: "Permissions fetched successfully",
        data: permission,
      });
    } catch (error) {
        next(error);
    }
  }
  async getPermissionById(id) {
    try {
      const permission = await permissionService.getPermissionById(id);
      return res.status(200).json({
        success: true,
        message: "Permission fetched successfully",
        data: permission,
      });
    } catch (error) {
      next(error);
    }
  }
  async createPermission(data) {
    try {
      const permission = await permissionService.createPermission(data);
      return res.status(200).json({
        success: true,
        message: "Permission created successfully",
        data: permission,
      });
    } catch (error) {
      next(error);
    }
  }
  async updatePermission(id, data) {
    try {
      const permission = await permissionService.updatePermission(id, data);
      return res.status(200).json({
        success: true,
        message: "Permission updated successfully",
        data: permission,
      });
    } catch (error) {
      next(error);
    }
  }
  async deletePermission(id) {
    try {
      const permission = await permissionService.deletePermission(id);
      return res.status(200).json({
        success: true,
        message: "Permission deleted successfully",
        data: permission,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PermissionController();
