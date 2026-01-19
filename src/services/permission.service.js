import AppError from "../utils/appError.js";

class PermissionService {
    async getAllPermissions() {
        
        return await PermissionRepository.getAllPermissions();
    }
    async getPermissionById(id) {
        if (!id) {
            throw new AppError("Permission ID is required");
        }
        if (typeof id !== "number") {
            throw new AppError("Permission ID must be a number");
        }

        return await PermissionRepository.getPermissionById(id);
    }
    async createPermission(data) {
        if (!data) {
            throw new AppError("Permission data is required");
        }
        return await PermissionRepository.createPermission(data);
    }
    async updatePermission(id, data) {
        if (!id) {
            throw new AppError("Permission ID is required");
        }
  
        if (!data) {
            throw new AppError("Permission data is required");
        }
        return await PermissionRepository.updatePermission(id, data);
    }
    async deletePermission(id) {
        if (!id) {
            throw new AppError("Permission ID is required");
        }
        return await PermissionRepository.deletePermission(id);
    }
}

export default new PermissionService();
