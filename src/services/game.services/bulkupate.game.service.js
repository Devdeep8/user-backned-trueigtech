import { BaseService } from "../base.service.js";

class BulkUpdateGamesService extends BaseService {
  async run() {
    const { gameIds, isActive } = this.args;
    // const { user } = this.context;


    const [affectedRows] = await this.db.game.update(
      {
        isActive,
      },
      {
        where: {
          id: gameIds,
          deletedAt: null,
        },
      },
    );
    if (affectedRows === 0) {
      throw new this.error("No games were updated", 404);
    }

    const updatedGames = await this.db.game.findAll({
      where: {
        id: gameIds,
        deletedAt: null,
      },
    });
    return updatedGames;
  }
}

export default BulkUpdateGamesService;
