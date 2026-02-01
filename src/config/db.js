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
});

// Test connection
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected successfully.");
  } catch (error) {
    throw new AppError("Database not authenticated", 502, { type: error });
  }
};
