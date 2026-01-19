// routes/userRoutes.js
import express from "express";
import userService from "../../user-service/user.service.js";
import { v4 as uuidv4 } from "uuid";

export const userRouter = express.Router();

// POST /create - Create a new user
userRouter.post("/create", async (req, res) => {
  const { name, email, password, role } = req.body;
  const userId = uuidv4();

  try {
    const user = await userService.createUser({
      id: userId,
      name,
      email,
      password,
      role,
    });

    res.status(202).json({
      message: "User registration accepted",
      status: "QUEUED_FOR_PROCESSING",
      userId,
    });
  } catch (error) {
    console.error("[Route Error]", error);
    res.status(500).json({ message: "Failed to queue user" });
  }
});

userRouter.get("/all-users", async (req, res) => {
  try {
    const users = await userService.getUser();

    res.status(200).json({
      total: users.length,
      data: users,
      status: "OK",
      message: "Users fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.delete("/delete/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    await userService.deleteUser(userId)
  } catch (error) {
    console.error("Delete Route Error:", error);
    res.status(500).json({ message: "Error queuing deletion" });
  }
});

import crypto from "crypto";
import AppError from "../../utils/appError.js";

userRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new AppError("User ID is required", 400 , false)
    }

    const user = await userService.getUserById(id);

    if (!user) {
      throw new AppError("User not found", 404 , false)
    }

    // 🔹 Create ETag from user data
    const etag = crypto
      .createHash("sha1")
      .update(JSON.stringify(user))
      .digest("hex");

    // 🔹 Compare with browser cache
    if (req.headers["if-none-match"] === etag) {
      console.log("🟡 Cache HIT → 304");
      return res.status(304).json({
        status: "OK",
        data: user,
        message: "User fetched successfully",
      });
    }

    console.log("🟢 Cache MISS → 200");

    // 🔹 Set cache headers
    res.setHeader("ETag", etag);
    res.setHeader("Cache-Control", "private, max-age=60"); // 60 seconds
    res.setHeader("Vary", "Accept-Language");

    res.status(200).json({
      status: "OK",
      data: user,
      message: "User fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching user by id:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Internal Server Error",
    });
  }
});




