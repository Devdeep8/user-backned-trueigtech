import express from "express";
import gameController from "../controllers/game.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadConfig.js";

const gameRoutes = express.Router();

// Public routes
gameRoutes.post("/create", gameController.createGame);
gameRoutes.post("/delete", gameController.deleteGame);
gameRoutes.post("/update", gameController.updateGame);
gameRoutes.post(
  "/bulkupload",
  authMiddleware.authenticate,
  authMiddleware.isAdmin,
  upload.single("file"),
  gameController.bulkUpload
);
gameRoutes.get(
  "/showallgames",
  authMiddleware.authenticate,
  gameController.showAllGames
);

gameRoutes.patch(
  "/toggleactive",
  authMiddleware.authenticate,
  authMiddleware.isAdmin,
  gameController.toggleActive
);

// Protected routes
// gameRoutes.get("/me", authMiddleware.authenticate, gameController.me);

export default gameRoutes;
