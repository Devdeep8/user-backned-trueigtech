import { DataTypes } from "@sequelize/core";
import { sequelize } from "../config/db.js";

export const Role = sequelize.define("Role", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
  },
  description: DataTypes.STRING,
}, {
  tableName: "roles",
});
