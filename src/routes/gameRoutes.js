import express from "express";
import gameController from "../controllers/game.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadConfig.js";

const gameRoutes = express.Router();

// Public routes
// Public routes (Actually protected)
gameRoutes.post(
  "/create",
  authMiddleware.authenticate,
  authMiddleware.authorize({
    permissions: ["game.create"],
  }),
  // Assuming createGame is the method for single creation, but the code had bulkUpload attached to /create?
  // Checking game.controller.js below.
  // If the user previously had bulkUpload on /create, I will keep it but usually /create is single.
  // Wait, line 15 was `gameController.bulkUpload`.
  // I will check the controller. If createGame exists, I should use it for /create and bulkUpload for /bulkupload.
  // The User's previous code snippet showed:
  // gameRoutes.post("/create", gameController.createGame); (Old)
  // gameRoutes.post("/create", ... bulkUpload); (New/Current)
  // This looks like a mistake in the previous user edit or my reading.
  // I will split them properly.
  gameController.createGame,
);

gameRoutes.post(
  "/bulkupload",
  authMiddleware.authenticate,
  authMiddleware.authorize({
    permissions: ["game.create"],
  }),
  upload.single("file"),
  gameController.bulkUpload,
);
gameRoutes.get(
  "/showallgames",
  authMiddleware.authenticate,
  authMiddleware.authorize({
    permissions: ["game.read"],
  }),
  gameController.showAllGames,
);

gameRoutes.delete(
  "/delete",
  authMiddleware.authenticate,
  authMiddleware.authorize({
    permissions: ["game.delete"],
  }),
  gameController.deleteGame,
);

gameRoutes.patch(
  "/update/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize({
    permissions: ["game.update"],
  }),
  gameController.updateGame,
);

gameRoutes.patch(
  "/bulk-status",
  authMiddleware.authenticate,
  authMiddleware.authorize({
    permissions: ["game.update"],
  }),
  gameController.bulkUpdate,
);

// Protected routes
// gameRoutes.get("/me", authMiddleware.authenticate, gameController.me);

export default gameRoutes;
