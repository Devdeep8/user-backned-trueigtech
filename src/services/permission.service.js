import AppError from "../utils/appError.js";
import PermissionRepository from "../dbOperation/permission.repository.js";
class PermissionService {
    async getAllPermissions() {
        try {
            return await PermissionRepository.getAllPermissions();
        } catch (error) {
            throw error;
        }
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

    async groupPermission() {
        const allGroupedPermission = await PermissionRepository.getGroupedPermissions({
            attributes: ["id","key", "description"],
            order: [["key", "ASC"]],
        });
        if (!allGroupedPermission) {
            throw new AppError("No permission found");
        }
        return allGroupedPermission;
    }
}

export default new PermissionService();
