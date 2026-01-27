// src/models/index.js
import { User } from "./user.model.js";
import { Role } from "./role.model.js";
import { Permission } from "./permission.model.js";

// Define associations in a separate function
export const associateModels = () => {
  User.belongsTo(Role, {
    foreignKey: "roleId",
    as: "userRole",
    inverse: { type: "hasMany", as: "users" },
  });
  Role.hasMany(User, {
    foreignKey: "roleId",
    as: "users",
    inverse: { type: "belongsTo", as: "userRole" },
  });

  Role.belongsToMany(Permission, {
    through: "RolePermissions",
    as: "permissions",
    foreignKey: "roleId",
    inverse: {
      as: "roles",
      foreignKey: "permissionId",
    },
  });
};

export { User, Role, Permission };
