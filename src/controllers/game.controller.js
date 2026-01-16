import gameService from "../services/game.service.js";
import AppError from "../utils/appError.js";

class GameController {
  async createGame(req, res, next) {
    try {
    } catch (error) {}
  }
  async deleteGame(req, res, next) {
    const { gameId } = req.body;
    try {
      const result = await gameService.deleteGame(gameId);
      return res.status(200).json({
        success: true,
        message: "Game deleted successfully",
        data: {
          game: result,
        },
      });
    } catch (error) {
      console.error("Delete Game Error:", error.message || error);

      next(error);
    }
  }
  async updateGame(req, res, next) {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const result = await gameService.updateGame({ data, id });
      return res.status(200).json({
        success: true,
        message: "Game updated successfully",
        data: {
          game: result,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async toggleActive(req, res, next) {
    try {
      const { gameId } = req.body;
      if (!gameId || !req.user.role) {
        throw new AppError("Game ID or role is missing", 400);
      }
      const result = await gameService.toggleActive({ gameId, role: req.role });
      return res.status(200).json({
        success: true,
        message: "Game toggled successfully",

        game: result,
      });
    } catch (error) {
      next(error);
    }
  }
  async bulkUpload(req, res, next) {
    try {
      const file = req.file;
      const {successful , failed} = await gameService.bulkUpload(file);
      return res.status(200).json({
        success: true,
        message: "Games uploaded successfully",
        data: {
          successful,
          failed,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async showAllGames(req, res, next) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await gameService.showAllGames({
        role: req.user.role,
        page,
        limit,
      });
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
