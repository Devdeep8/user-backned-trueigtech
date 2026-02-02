// src/config/database.js
import dotenv from "dotenv";
import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import AppError from "../utils/appError.js";

dotenv.config();

export const sequelize = new Sequelize({
  dialect: PostgresDialect,
  url: process.env.DATABASE_URL,

  logging: process.env.DB_LOGGING === "true" ? console.log : false,

  pool: {
    max: 10,        // max DB connections
    min: 2,         // keep some warm connections
    acquire: 30000, // wait time before throwing error
    idle: 10000,    // close idle connections
  },

  define: {
    paranoid: true,      // soft delete by default
    timestamps: true,   // createdAt, updatedAt
    underscored: false, // camelCase columns
  },
});

// Connect only ONCE on app boot
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected with pool.");
  } catch (error) {
    console.error("❌ DB connection failed:", error);
    throw new AppError("Database not authenticated", 502, { cause: error });
  }
};
