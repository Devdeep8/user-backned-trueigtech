// routes/authRoutes.js

import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleController from "../controllers/role.controller.js";

 const roleRoutes = express.Router();

roleRoutes.get("/all", authMiddleware.authenticate, roleController.getAllRoles);


export default roleRoutes;
