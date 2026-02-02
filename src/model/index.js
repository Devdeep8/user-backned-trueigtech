// src/models/index.js
import { User } from "./user.model.js";
import { Role } from "./role.model.js";
import { Permission } from "./permission.model.js";
import {Games} from "./game.model.js"
import {sequelize} from "../config/db.js";
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

// Create a single db object
const db = {
  user: User,
  game: Games,
  role: Role,
  permission: Permission,
  sequelize: sequelize, 
};


export { User, Role, Permission , db };
