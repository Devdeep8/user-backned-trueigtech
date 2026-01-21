// routes/authRoutes.js

import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import userController from "../controllers/user.controller.js";

const userRoutes = express.Router();

// protected routes

userRoutes.post(
  "/create",
  authMiddleware.authenticate,
  authMiddleware.authorize({
    permissions: ["user.create"],
  }),
  userController.createUser,
);

userRoutes.get(
  "/all",
  authMiddleware.authenticate,
  authMiddleware.authorize({
    permissions: ["user.read"],
  }),
  userController.getAllUsers,
);
userRoutes.patch(
  "/update/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize({
    permissions: ["user.update"],
  }),
  userController.updateUser,
);
userRoutes.patch(
  "/toggle/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize({
    permissions: ["user.update"], // or user.delete if logically soft delete
  }),
  userController.toggleActive,
);
userRoutes.post(
  "/logout/:id",
  authMiddleware.authenticate,
  userController.forceLogout,
);

userRoutes.patch(
  "/:id",
  authMiddleware.authenticate,
  userController.updateUser,
);

userRoutes.get("/:id", authMiddleware.authenticate, userController.getUserById);
// userRoutes.delete("delete/:id" , authMiddleware.authenticate,authMiddleware.isAdmin, userController.deleteUser);
// userRoutes.patch("toggle/:id" , authMiddleware.authenticate,authMiddleware.isAdmin, userController.toggleActive);
//use update
export default userRoutes;
