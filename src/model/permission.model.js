import { DataTypes } from "@sequelize/core";
import { sequelize } from "../config/db.js";

export const Permission = sequelize.define("Permission", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  key: {
    type: DataTypes.STRING,
    unique: true,
  },
  description: DataTypes.STRING,
}, {
  tableName: "permissions",
});

