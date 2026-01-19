import { Permission } from "../model/index.js";
class PermissionRepository {
    constructor() {
        this.Permission = Permission;
    }
    async getAllPermissions() {
        return await this.Permission.findAll();
    }
    async getPermissionById(id) {
        return await this.Permission.findByPk(id);
    }
    async createPermission(data) {
        return await this.Permission.create(data);
    }
    async updatePermission(id, data) {
        return await this.Permission.update(data, { where: { id } });
    }
    async deletePermission(id) {
        return await this.Permission.destroy({ where: { id } });
    }
}
export default new PermissionRepository();