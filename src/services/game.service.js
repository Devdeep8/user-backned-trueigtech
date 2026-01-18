import AppError from "../utils/appError.js";
import { Games } from "../model/game.model.js";
import * as gameDbops from "../dbOperation/game.repository.js";
import csvParser from "csv-parser";
import fs from "fs";

class GameService {
  async createGame(data) {
    if (!data.name) throw new AppError("Game name is required", 400);
    try {
      return await gameDbops.createGameRecord(data);
    } catch (err) {
      throw new AppError(err.message || "Failed to create game", 500);
    }
  }

  async deleteGame(gameId) {
    if (!gameId) throw new AppError("Game ID is required", 400);
    return await gameDbops.softDeleteGame(gameId);
  }
  async updateGame({ data, id }) {
    if (!id || !data) {
      throw new AppError("gameId required and data also", 400);
    }

    const result = await gameDbops.updateGameById(id, data);

    console.log(result);
    if (!affected) throw new AppError("Game not found", 404);

    return await Games.findByPk(id);
  }
  async toggleActive({ gameId }) {
    if (!gameId) {
      throw new AppError("Game ID is required", 400);
    }
    try {
      const game = await gameDbops.toggleActive(gameId);
      if (!game) {
        throw new AppError("Game not found", 404);
      }
      return game;
    } catch (error) {
      throw error;
    }
  }
  async bulkUpload(file) {
    if (!file) throw new AppError("No file uploaded", 400);

    const games = [];

    // 1️⃣ Read CSV into array
    await new Promise((resolve, reject) => {
      fs.createReadStream(file.path)
        .pipe(csvParser())
        .on("data", (data) => {
          games.push({
            name: data.name || null,
            description: data.description || null,
            genre: data.genre || null,
            imageUrl: data.imageUrl || null,
            gameUrl: data.gameUrl || null,
            isActive: data.isActive === "true" || data.isActive === true,
          });
        })
        .on("end", resolve)
        .on("error", (err) => reject(new AppError("Failed to parse CSV", 500)));
    });

    if (games.length === 0) {
      await fs.promises.unlink(file.path);
      throw new AppError("CSV file is empty", 400);
    }

    const successful = [];
    const failed = [];

    try {
      if (games.length > 600) {
        // 🔹 Large file → bulkCreate for speed
        try {
          const uploadedGames = await Games.bulkCreate(games, {
            validate: true,
          });
          successful.push(...uploadedGames);
        } catch (bulkErr) {
          // If bulkCreate fails, all rows fail, log error
          games.forEach((g, idx) =>
            failed.push({ row: idx + 1, data: g, error: bulkErr.message })
          );
        }
      } else {
        // 🔹 Small/medium file → batch + Promise.allSettled
        const batchSize = 100;
        for (let i = 0; i < games.length; i += batchSize) {
          const batch = games.slice(i, i + batchSize);

          const results = await Promise.allSettled(
            batch.map((game) => this.createGame(game))
          );

          results.forEach((res, index) => {
            if (res.status === "fulfilled") successful.push(res.value);
            else
              failed.push({
                row: i + index + 1,
                data: batch[index],
                error: res.reason.message || "Unknown error",
              });
          });
        }
      }

      return { successful, failed };
    } catch (err) {
      throw new AppError(err.message || "Bulk upload failed", 500);
    } finally {
      // ✅ Always delete the file
      try {
        await fs.promises.unlink(file.path);
      } catch (unlinkErr) {
        console.error("Failed to delete CSV file:", unlinkErr);
      }
    }
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
