import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const RolePermission = sequelize.define("RolePermission", {
  roleId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  permissionId: {
    type: DataTypes.UUID,
    unique: true,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
}, {
  tableName: "rolepermissions",
});

