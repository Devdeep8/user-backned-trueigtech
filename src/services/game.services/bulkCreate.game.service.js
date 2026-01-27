import { BaseService } from "../base.service.js";

class BulkCreateGameService extends BaseService {
  async run() {
    const { games } = this.args;
    const { user } = this.context;

    if (!games || !games.length) throw this.error("No games provided", 400);

    const successful = [];
    const failed = [];

    // Normalize
    const normalizedGames = games.map((g) => ({
      id: g.id || undefined,
      name: g.name?.trim() || null,
      description: g.description?.trim() || null,
      genre: g.genre?.trim() || null,
      imageUrl: g.imageUrl?.trim() || null,
      gameUrl: g.gameUrl?.trim() || null,
      isActive: g.isActive === "TRUE" || g.isActive === true,
    }));

    try {
      const createdGames = await this.db.game.bulkCreate(normalizedGames, {
        updateOnDuplicate: [
          "description",
          "genre",
          "imageUrl",
          "gameUrl",
          "isActive",
        ],
        validate: true,
      });

      successful.push(...createdGames);
    } catch (err) {
      // If bulkCreate fails, log all rows as failed
      normalizedGames.forEach((g, idx) => {
        failed.push({ row: idx + 1, data: g, error: err.message });
      });
    }

    return { data: "success", games: normalizedGames };
  }
}

export default BulkCreateGameService;
