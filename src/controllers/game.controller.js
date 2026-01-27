import db from "../model/db.js";
import BulkCreateGameService from "../services/game.services/bulkCreate.game.service.js";
import BulkUpdateGamesService from "../services/game.services/bulkupate.game.service.js";
import GetAllGamesService from "../services/game.services/get.game.service.js";
import UpdateGameService from "../services/game.services/update.game.service.js";
import AppError from "../utils/appError.js";
import fs from "fs";
import csvParser from "csv-parser";
import DeleteService from "../services/game.services/softDelete.game.service.js";

class GameController {
  async createGame(req, res, next) {
    try {
    } catch (error) {}
  }
  async deleteGame(req, res, next) {
    const { gameId } = req.body;
    try {
      const deleteService = new DeleteService(
        AppError,
        { id: gameId },
        {
          user: req.user,
          requestId: req.requestId,
        },
        db,
      );
      const result = await deleteService.execute();
      return res.status(200).json({
        success: true,
        message: "Game deleted successfully",
        data: {
          game: result,
        },
      });
    } catch (error) {
      console.error("Delete Game Error:", error.message || error);
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || "Something went wrong",
        meta: error.meta || null,
      });
    }
  }
  async updateGame(req, res, next) {
    try {
      const { id } = req.params;
      const { data } = req.body;
      // console.log(id, data);
      if (!id || !data) {
        throw new AppError("Game ID or data is missing", 400);
      }
      if (!req.user.role) {
        throw new AppError("Role is missing", 400);
      }

      const context = {
        user: req.user, // from auth middleware
        requestId: req.requestId, // optional
      };

      const updateGameService = new UpdateGameService(
        AppError,
        { data, id },
        context,
        db,
      );
      const result = await updateGameService.execute();

      return res.status(200).json({
        success: true,
        message: "Game updated successfully",
        data: {
          game: result,
        },
      });
    } catch (error) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || "Something went wrong",
        meta: error.meta || null,
      });
    }
  }
  async bulkUpdate(req, res, next) {
    try {
      const { gameIds, isActive } = req.body;
      console.log(gameIds, isActive, "debug");

      if (!gameIds) {
        throw new AppError("Games or isActive is missing", 400);
      }
      const context = {
        user: req.user,
        requestId: req.requestId,
      };

      const bulkUpdateGamesService = new BulkUpdateGamesService(
        AppError,
        { gameIds, isActive },
        context,
        db,
      );
      const result = await bulkUpdateGamesService.execute();

      return res.status(200).json({
        success: true,
        message: "Games updated successfully",
        data: {
          games: result,
        },
      });
    } catch (error) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || "Something went wrong",
        meta: error.meta || null,
      });
    }
  }
  async toggleActive(req, res, next) {
    try {
      const { gameId } = req.body;
      if (!gameId || !req.user.role) {
        throw new AppError("Game ID or role is missing", 400);
      }
      const updateGameService = new UpdateGameService(
        AppError,
        { id: gameId, isActive: !req.body.isActive },
        { user: req.user },
        db,
      );
      const result = await updateGameService.execute();
      return res.status(200).json({
        success: true,
        message: "Game toggled successfully",

        game: result,
      });
    } catch (error) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || "Something went wrong",
        meta: error.meta || null,
      });
    }
  }
  async bulkUpload(req, res, next) {
    const file = req.file;

    if (!file) return next(new AppError("No file uploaded", 400));

    const games = [];

    try {
      // 1️⃣ Read CSV into array
      await new Promise((resolve, reject) => {
        fs.createReadStream(file.path)
          .pipe(csvParser())
          .on("data", (row) => {
            games.push({
              id: row.id || undefined, // if provided
              name: row.name || null,
              description: row.description || null,
              genre: row.genre || null,
              imageUrl: row.imageUrl || null,
              gameUrl: row.gameUrl || null,
              isActive: row.isActive === "TRUE" || row.isActive === true,
            });
          })
          .on("end", resolve)
          .on("error", (err) =>
            reject(new AppError("Failed to parse CSV", 500)),
          );
      });

      if (!games.length) throw new AppError("CSV file is empty", 400);

      // 2️⃣ Call BulkCreateGameService
      console.log(games, "debug");

      const service = new BulkCreateGameService(
        AppError,
        { games },
        { user: req.user },
        db,
      );
      const { successful, failed } = await service.run();
      console.log(successful, failed, "debug");

      return res.status(200).json({
        success: true,
        message: "Games uploaded successfully",
        data: {
          successful,
          failed,
        },
      });
    } catch (err) {
      next(err);
    } finally {
      // ✅ Delete CSV file safely
      try {
        if (file?.path) await fs.promises.unlink(file.path);
      } catch (unlinkErr) {
        console.error("Failed to delete CSV file:", unlinkErr);
      }
    }
  }
  async showAllGames(req, res, next) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const genre = req.query.genre || null;
      const search = req.query.search || null;
      const status = req.query.status || null;
      const sortBy = req.query.sortBy || "";
      const sortOrder = req.query.sortOrder || "";

      const pagination = { page, limit };
      const dateRange = req.query.dateRange || "";
      const filter = {};
      if (status) filter.isActive = status === "active" ? true : false;
      if (genre) filter.genre = genre;

      const context = {
        user: req.user, // from auth middleware
      };

      const getAllGamesService = new GetAllGamesService(
        AppError,
        { filter, search, pagination, dateRange },
        context,
        db,
      );
      const result = await getAllGamesService.run();

      return res.status(200).json({
        success: true,
        message: "Games retrieved successfully",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new GameController();
