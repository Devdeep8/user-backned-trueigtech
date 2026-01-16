import AppError from "../utils/appError.js";
import { Games } from "../model/game.model.js";
import csvParser from "csv-parser";
import fs from "fs";

class GameService {
  async deleteGame(gameId) {
    if (!gameId){
        throw new AppError("Game Id is not defined", 400)
    }
    const softDelete = await Games.update({deletedAt: new Date()},{where:{id:gameId}})
    return softDelete
  }
  async updateGame({ data, id }) {
    if (!id || !data) {
      throw new AppError("gameId required and data also", 400);
    }

    const { name, description, genre, imageUrl, gameUrl, isActive } = data;
    const [affectedRows] = await Games.update(
      {
        name,
        description,
        genre,
        imageUrl,
        gameUrl,
        isActive,
      },
      {
        where: { id },
      }
    );

    if (affectedRows === 0) {
      throw new AppError("Game not found", 404);
    }

    return await Games.findByPk(id);
  }
  async toggleActive({ gameId, role }) {
    if (!gameId) {
      throw new AppError("Game ID is required", 400);
    }
    try {
      const game = await Games.findByPk(gameId);
      if (!game) {
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
    const games = [];

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
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        });
      })
      .on("end", async () => {
        try {
          const uploadedGames = await Games.bulkCreate(games, {
            validate: true,
          });

          // ✅ delete file after successful upload
          await fs.promises.unlink(file.path);

          return uploadedGames;
        } catch (err) {
          // delete file even if DB fails
          await fs.promises.unlink(file.path);
          throw new AppError("Failed to upload games", 500);
        }
      })
      .on("error", async (error) => {
        console.error("Error parsing CSV:", error);

        // delete file on parsing error
        await fs.promises.unlink(file.path);

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
