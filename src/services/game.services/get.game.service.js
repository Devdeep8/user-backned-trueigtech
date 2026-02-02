import { GenericGetService } from "../../RESTapi/genericGetAPi.js";

class GetAllGamesService extends GenericGetService {
  async run() {
    const backendFilters = {};
    console.log("this.args :>> ", this.args);
    const { where, order, limit, offset, page } =
      await this.buildQuery(backendFilters);

    // 🔒 Enforce system constraints (never trust client fully)
    const ormWhere = {
      ...where,
      deletedAt: null, // override always
    };

    const { count, rows: games } = await this.db.game.findAndCountAll({
      where: ormWhere,
      limit,
      offset,
      order: order,
      attributes: [
        "id",
        "name",
        "description",
        "imageUrl",
        "gameUrl",
        "rating",
        "isActive",
      ],
      include: [
        {
          model: this.db.category,
          as: "category",
          attributes: ["id", "name"], // ✅ frontend gets category name also
        },
      ],
    });

    return {
      page: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
      games,
    };
  }
}

export default GetAllGamesService;
