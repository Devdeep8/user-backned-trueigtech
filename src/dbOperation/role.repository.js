import { Role, Permission } from "../model/index.js";
class RoleRepository {
  constructor() {
    this.Role = Role;
  }
  async getRoleByIdentifier(where) {
    return await this.Role.findOne({ where });
  }

  async getAllRoles() {
    return await this.Role.findAll();
  }

  async getRoleById(id) {
    return await this.Role.findByPk(id);
  }

  async createRole(data) {
    return await this.Role.create(data);
  }

  async updateRole(id, data) {
    return await this.Role.update(data, { where: { id } });
  }

  async roleWithPermissions() {
    return await this.Role.findAll({
      attributes: ["id", "name"], // 👈 drop timestamps & description if not needed
      include: [
        {
          model: Permission,
          as: "permissions",
          attributes: ["id", "key"], // 👈 only what UI needs
          through: {
            attributes: [], // 👈 REMOVE RolePermissions completely
          },
        },
      ],
    });
  }

  
}

export default new RoleRepository();
