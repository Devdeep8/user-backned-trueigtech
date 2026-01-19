// routes/authRoutes.js

import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import userController from "../controllers/user.controller.js";

const userRoutes = express.Router();

// protected routes
userRoutes.get(
  "/all",
  authMiddleware.authenticate,
    authMiddleware.authorize({
    roles: ["super_admin" , "admin"],
    permissions: ["manage_users"],
  }),
  userController.getAllUsers,
);
userRoutes.patch(
  "/update/:id",
  authMiddleware.authenticate,
    authMiddleware.authorize({
    roles: ["super_admin" , "admin"],
    permissions: ["manage_users"],
  }),
  userController.updateUser,
);
userRoutes.patch(
  "/toggle/:id",
  authMiddleware.authenticate,
    authMiddleware.authorize({
    roles: ["super_admin" , "admin"],
    permissions: ["manage_users"],
  }),
  userController.toggleActive,
);
userRoutes.post(
  "/logout/:id",
  authMiddleware.authenticate,
  authMiddleware.isAdmin,
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
