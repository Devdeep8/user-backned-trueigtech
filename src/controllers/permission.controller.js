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
  async getPermissionById(req , res , next) {
    const id = req.params.id;
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
  async createPermission(req , res , next) {
    const data = req.body;
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
  async updatePermission( req , res , next) {
    const id = req.params.id;
    const data = req.body;
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
  async deletePermission(req , res , next) {
    const id = req.params.id;
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

  async groupPermission(req , res , next) {
    try {
      const permission = await permissionService.groupPermission();
      return res.status(200).json({
        success: true,
        message: "Permission grouped successfully",
        data: permission,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PermissionController();
