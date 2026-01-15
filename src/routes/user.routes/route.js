// routes/userRoutes.js
import express from "express";
import userService from "../../user-service/user.service.js";

export const userRouter = express.Router();

// POST /create - Create a new user
userRouter.post("/create", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
   const user = await userService.createUser({
    name, 
    email,
    password, 
    role
   })

   res.status(202).json({
      message: 'User registration accepted',
      status: 'QUEUED_FOR_PROCESSING'
    });

  } catch (error) {
    console.error("[Route Error]", error);
    res.status(500).json({ message: 'Failed to queue user' });
  }
});

userRouter.get("/all-users", async (req, res) => {
  try {
    const users =await userService.getUser()

    res.status(200).json({
      total: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
