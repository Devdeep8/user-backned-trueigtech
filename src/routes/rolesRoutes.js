// routes/authRoutes.js

import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleController from "../controllers/role.controller.js";

 const roleRoutes = express.Router();

roleRoutes.get("/all", authMiddleware.authenticate, roleController.getAllRoles);
roleRoutes.post("/create" , authMiddleware.authenticate , authMiddleware.authorize({
    roles: ["super_admin" , "admin"],
    permissions: ["manage_roles"],
}), roleController.createRole)
roleRoutes.patch("/update/:id" , authMiddleware.authenticate , authMiddleware.authorize({
    roles: ["super_admin" , "admin"],
    permissions: ["manage_roles"],
}), roleController.updateRole)



export default roleRoutes;
