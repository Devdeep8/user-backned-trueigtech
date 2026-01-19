import express from "express";
import gameController from "../controllers/game.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadConfig.js";

const gameRoutes = express.Router();

// Public routes
gameRoutes.post("/create", authMiddleware.authenticate,
    authMiddleware.authorize({
    roles: ["super_admin" ],
    permissions: ["manage_games"],
  }),
  upload.single("file"),
  gameController.bulkUpload
);
gameRoutes.get(
  "/showallgames",
  authMiddleware.authenticate,
  authMiddleware.authorize({
    roles: ["super_admin" ],
    permissions: ["manage_games"],
  }),
  gameController.showAllGames
);

gameRoutes.patch(
  "/toggleactive",
  authMiddleware.authenticate,
    authMiddleware.authorize({
    roles: ["super_admin" ],
    permissions: ["manage_games"],
  }),
  gameController.toggleActive
);

// Protected routes
// gameRoutes.get("/me", authMiddleware.authenticate, gameController.me);

export default gameRoutes;
