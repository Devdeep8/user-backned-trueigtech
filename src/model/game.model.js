import { DataTypes } from "@sequelize/core";
import { sequelize } from "../config/database.js";
export const Game = sequelize.define(
  "Game",
  {
    // 1. ID (handled by Sequelize by default, but explicit here)
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // 2. Name
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 3. Description
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // 4. Genre
    genre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // 5. Image URL
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    // 6. Game URL (The link to load the game)
    gameUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    // 7. Is Active
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // 9. Rating
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      defaultValue: 0.0,
      comment: "Average rating of the game (0.00 to 5.00)",
    },
    categoryId: { type: DataTypes.UUID, allowNull: true }, // new column
  },
  {
    // Enable paranoid mode for automatic soft delete handling
    paranoid: true,
    tableName: "games",
  },
);
