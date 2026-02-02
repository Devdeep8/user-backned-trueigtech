// src/models/index.js
import { sequelize } from "../config/database.js";

import { User } from "./user.model.js";
import { Role } from "./role.model.js";
import { Permission } from "./permission.model.js";
import { Game } from "./game.model.js";
import { RolePermission } from "./rolepermissions.model.js";

export const associateModels = () => {
  // User ↔ Role (Many Users belong to One Role)
  User.belongsTo(Role, { foreignKey: "roleId", as: "role" });
  Role.hasMany(User, { foreignKey: "roleId", as: "users" });

  // Role ↔ Permission (Many-to-Many) ✅ FIXED
  Role.belongsToMany(Permission, {
    through: RolePermission,
    as: "permissions",
    foreignKey: "roleId",
    otherKey: "permissionId",
  });

  Permission.belongsToMany(Role, {
    through: RolePermission,
    as: "roles",
    foreignKey: "permissionId",
    otherKey: "roleId",
  });
};
export const db = {
  sequelize,
  user: User,
  role: Role,
  permission: Permission,
  game: Game,
  rolePermission: RolePermission,
};
