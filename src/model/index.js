// src/models/index.js
import { User } from "./user.model.js";
import { Games } from "./game.model.js";
import { Role } from "./role.model.js";
import { Permission } from "./permission.model.js";
// Associations
User.belongsTo(Role, { foreignKey: "roleId", as: "userRole" });
Role.hasMany(User, { foreignKey: "roleId", as: "users" });

Role.belongsToMany(Permission, {
  through: "RolePermissions",
  as: "permissions",
  foreignKey: "roleId",
});
Permission.belongsToMany(Role, {
  through: "RolePermissions",
  as: "roles",
  foreignKey: "permissionId",
});

export { User, Games, Role, Permission };
