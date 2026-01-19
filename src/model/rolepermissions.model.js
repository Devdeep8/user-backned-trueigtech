import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const RolePermission = sequelize.define(
  "RolePermission",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    permissionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "RolePermissions", // MUST MATCH
    timestamps: true,
  }
);

