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
