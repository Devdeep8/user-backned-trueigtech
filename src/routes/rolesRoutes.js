// routes/authRoutes.js

import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleController from "../controllers/role.controller.js";

const roleRoutes = express.Router();

roleRoutes.get(
  "/all",
  authMiddleware.authenticate,
  authMiddleware.authorize({
    permissions: ["role.read"],
  }),
  roleController.getAllRoles,
);
roleRoutes.post(
  "/create",
  authMiddleware.authenticate,
  authMiddleware.authorize({
    permissions: ["role.create"],
  }),
  roleController.createRole,
);
roleRoutes.patch(
  "/update/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize({
    permissions: ["role.update"],
  }),
  roleController.updateRole,
);
roleRoutes.get(
  "/with-permissions",
  authMiddleware.authenticate,
  authMiddleware.authorize({
    permissions: ["role.read"],
  }),
  roleController.roleWithPermissions,
);
roleRoutes.post(
  "/:roleId/permissions",
  authMiddleware.authenticate,
  authMiddleware.authorize({
    permissions: ["permission.assign"],
  }),
  roleController.createRolePermission,
);
roleRoutes.delete(
  "/:roleId/permissions/:permissionId",
  authMiddleware.authenticate,
  authMiddleware.authorize({
    permissions: ["permission.assign"],
  }),
  roleController.deleteRolePermission,
);

export default roleRoutes;
