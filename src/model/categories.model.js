// src/models/category.model.js
import { DataTypes } from "@sequelize/core";
import { sequelize } from "../config/database.js";

export const Category = sequelize.define(
  "Category",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "categories",
    timestamps: true,
    paranoid: true, // for soft delete
  }
);
