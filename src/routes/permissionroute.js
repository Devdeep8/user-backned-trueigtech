// routes/authRoutes.js

import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionController from "../controllers/permission.controller.js";
 const permissionRoutes = express.Router();

permissionRoutes.get("/all", authMiddleware.authenticate, permissionController.getAllPermissions);
permissionRoutes.post("/create" , authMiddleware.authenticate, permissionController.createPermission)
permissionRoutes.patch("/update/:id" , authMiddleware.authenticate , permissionController.updatePermission)



export default permissionRoutes;
