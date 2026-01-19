import permissionService from "../services/permission.service.js";

class PermissionController {
  async getAllPermissions() {
    try {
      return await permissionService.getAllPermissions();
    } catch (error) {
        throw error;
    }
  }
  async getPermissionById(id) {
    return await permissionService.getPermissionById(id);
  }
  async createPermission(data) {
    return await permissionService.createPermission(data);
  }
  async updatePermission(id, data) {
    return await permissionService.updatePermission(id, data);
  }
  async deletePermission(id) {
    return await permissionService.deletePermission(id);
  }
}

export default new PermissionController();
