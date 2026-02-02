// routes/permissionroute.js  

import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import categoriesController from "../controllers/categories.controller.js";
 const categoriesRoutes = express.Router();


categoriesRoutes.get("/" , authMiddleware.authenticate , categoriesController.getAllCategories)


export default categoriesRoutes;
