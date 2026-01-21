// src/services/game.services/getAll.games.service.js
import { GenericGetService } from "../../RESTapi/genericGetAPi.js";

class GetAllGamesService extends GenericGetService {
  async run() {
    // Backend filters specific to this entity
    const backendFilters = {}; // default for normal users

    // Build query parameters using GenericGetService
    const { where, limit, offset, page } = await this.buildQuery(
      backendFilters
    );



    // Query database
    const { rows: games, count: total } = await this.db.game.findAndCountAll({
      where,
      limit,
      offset,
    });

    return {meta:{ page, limit, total}, games };
  }
}

export default GetAllGamesService;
