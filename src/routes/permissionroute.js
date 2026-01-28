// routes/permissionroute.js  

import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionController from "../controllers/permission.controller.js";
const permissionRoutes = express.Router();

permissionRoutes.get(
  "/all",
  authMiddleware.authenticate,
  authMiddleware.authorize({
    permissions: ["permission.read"],
  }),
  permissionController.getAllPermissions,
);
permissionRoutes.post(
  "/create",
  authMiddleware.authenticate,
  authMiddleware.authorize({
    roles: ["super_admin"], // Restricted to Super Admin for now as 'permission.create' key wasn't seeded
  }),
  permissionController.createPermission,
);
permissionRoutes.patch(
  "/update/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize({
    roles: ["super_admin"],
  }),
  permissionController.updatePermission,
);
permissionRoutes.get(
  "/group",
  authMiddleware.authenticate,
  authMiddleware.authorize({
    permissions: ["permission.read"],
  }),
  permissionController.groupPermission,
);

export default permissionRoutes;
