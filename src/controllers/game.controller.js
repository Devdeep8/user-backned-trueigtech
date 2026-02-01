import BulkCreateGameService from "../services/game.services/bulkCreate.game.service.js";
import BulkUpdateGamesService from "../services/game.services/bulkupate.game.service.js";
import GetAllGamesService from "../services/game.services/get.game.service.js";
import UpdateGameService from "../services/game.services/update.game.service.js";
import AppError from "../utils/appError.js";
import fs from "fs";
import csvParser from "csv-parser";
import DeleteService from "../services/game.services/softDelete.game.service.js";
import { httpStatus } from "../helper/http-status.js";
class GameController {
  async createGame(req, res, next) {
    try {
    } catch (error) {}
  }
  async deleteGame(req, res, next) {
    const { gameId } = req.body;

    const deleteService = new DeleteService(
      { id: gameId },
      {
        user: req.user,
        requestId: req.requestId,
      },
    );
    const result = await deleteService.execute();
    if (!result.success) {
      return res.status(result.error.statusCode).json({
        success: false,
        message: result.error.message,
        code: result.error.code,
        meta: result.meta,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Game deleted successfully",
      data: {
        game: result,
      },
    });
  }
  async updateGame(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;

      const updateGameService = new UpdateGameService(
        { data, id },
        { user: req.user, requestId: req.requestId },
      );

      const result = await updateGameService.execute();

      // ✅ One line - BaseService handles everything!
      return res.status(httpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
  async bulkUpdate(req, res, next) {
    try {
      const { gameIds, isActive } = req.body;

      if (!gameIds) {
        throw new AppError("Games or isActive is missing", 400);
      }
      const context = {
        user: req.user,
        requestId: req.requestId,
      };

      const bulkUpdateGamesService = new BulkUpdateGamesService(
        { gameIds, isActive },
        context,
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

      const service = new BulkCreateGameService({ games }, { user: req.user });
      const { successful, failed } = await service.run();

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
      const limit = 1 || 10;
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
        requestId: req.requestId,
      };

      const getAllGamesService = new GetAllGamesService(
        { filter, search, pagination, dateRange },
        context,
      );
      const result = await getAllGamesService.execute();

      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default new GameController();
