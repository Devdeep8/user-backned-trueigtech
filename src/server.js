// app.js - Call connectDB before starting server
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import { associateModels } from "./model/index.js";
import { userRouter } from "./routes/user.routes/route.js";
import gameRoutes from "./routes/gameRoutes.js";
import errorHandler from "./middlewares/errormiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import roleRoutes from "./routes/rolesRoutes.js";
import permissionRoutes from "./routes/permissionroute.js";

const app = express();
const PORT = process.env.PORT || 6001;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/user", userRouter);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use(errorHandler);

app.get("/health", async (req, res) => {
  console.log("health check");
  console.log(JSON.stringify(req.headers["user-agent"]));
  try {
    // Example DB check
    await connectDB(); // Sequelize / Prisma / knex ping
    return res.status(200).json({
      status: "OK",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.log(error);
  }
});

// ✅ Connect to DB first, then start server
const startServer = async () => {
  await connectDB();
  associateModels();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();

export default app;
