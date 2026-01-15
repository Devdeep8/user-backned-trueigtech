import AppError from "../utils/appError.js";
import { Games } from "../model/game.model.js";
import csvParser from "csv-parser";
import fs from "fs";
import { validate } from "uuid";

class GameService {
  async deleteGame() {}
  async updateGame() {}
  async toggleActive({gameId , role}){
    if (!gameId){
      throw new AppError("Game ID is required", 400);
    }
    try {
      const game = await Games.findByPk(gameId);
      if(!game){
        throw new AppError("Game not found", 404);
      }
      game.isActive = !game.isActive;
      await game.save();
      return game;
    } catch (error) {
      throw error;
    }
  }
  async bulkUpload(file) {
    const game = [];
    fs.createReadStream(file.path)
      .pipe(
        csvParser().on("data", (data) => {
          game.push({
            name: data.name || null,
            description: data.description || null,
            genre: data.genre || null,
            imageUrl: data.imageUrl || null,
            gameUrl: data.gameUrl || null,
            isActive: data.isActive || null,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            // Add other columns your table has
          });
        })
      )
      .on("end", async () => {
        const uploadedGames = await Games.bulkCreate(game, { validate: true });
        return uploadedGames;
      })
      .on("error", (error) => {
        console.error("Error parsing CSV:", error);
        throw new AppError("Failed to parse CSV file", 500);
      });
  }
  async showAllGames({ role, page, limit }) {
    console.log(role);
    try {
      const offset = (page - 1) * limit;

      const whereCondition =
        role === "admin"
          ? { deletedAt: null }
          : { deletedAt: null, isActive: true };

      const { rows, count } = await Games.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      return {
        games: rows,
        pagination: {
          totalItems: count,
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          limit,
        },
      };
    } catch (error) {
      throw new AppError("Failed to fetch games", 500);
    }
  }
}

export default new GameService();
