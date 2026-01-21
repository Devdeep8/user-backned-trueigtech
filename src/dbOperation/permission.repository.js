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

  async getGroupedPermissions(options) {
    // Get all permissions
    const permissions = await this.Permission.findAll(options);

    // Group by resource (part before ":")
    const grouped = permissions.reduce((acc, perm) => {
      const [resource, action] = perm.key.split(".");

      if (!acc[resource]) {
        acc[resource] = [];
      }

      acc[resource].push({
        id: perm.id,
        key: perm.key,
        action: action,
        description: perm.description,
      });

      return acc;
    }, {});

    return grouped;
  }
}
export default new PermissionRepository();
