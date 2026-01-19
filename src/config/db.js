// src/config/database.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import AppError from "../utils/appError.js";

dotenv.config();
// Docker Connection String:
// Protocol: postgres
// User: admin
// Pass: admin
// Host: db (This is the name from docker-compose.yml)
// DB Name: userdb
export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: process.env.DB_LOGGING === "true" ? console.log : false,
});

// Function to test the connection
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "✅ Connection to PostgreSQL has been established successfully.",
    );
    console.log("✅ Database Synced (Tables checked/created).");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    throw new AppError("Database not authenticated", 502, {
      cause: error,
      meta: { db: process.env.DATABASE_URL },
    });
  }
};
