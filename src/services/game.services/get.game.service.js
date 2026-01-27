// src/services/game.services/getAll.games.service.js
import { GenericGetService } from "../../RESTapi/genericGetAPi.js";
import { QueryTypes } from "sequelize";

class GetAllGamesService extends GenericGetService {
  async run() {
    const backendFilters = {};
    const { where, limit, offset, page } = await this.buildQuery(backendFilters);

    console.log("WHERE (filters):", where);
    console.log("LIMIT (per page):", limit);
    console.log("OFFSET (skip):", offset);
    console.log("PAGE (current):", page);

    // ============================================
    // BUILD WHERE CLAUSE - WITH PROPER QUOTES
    // ============================================
    let whereConditions = ['"deletedAt" IS NULL']; // ✅ Add quotes!
    let replacements = {};

    // SEARCH FILTER
    const searchTerm = this.query?.search || this.params?.search || where?.search;
    
    if (searchTerm) {
      whereConditions.push('(name ILIKE :search OR description ILIKE :search)');
      replacements.search = `%${searchTerm}%`;
    }

    // OTHER FILTERS from 'where' object
    Object.entries(where).forEach(([key, value]) => {
      console.log(key, value);
      if (key !== 'deletedAt' && key !== 'search' && value !== null && value !== undefined) {
        whereConditions.push(`"${key}" = :${key}`); // ✅ Quotes for camelCase
        replacements[key] = value;
      }
    });

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(" AND ")}`
      : "";

    console.log("SQL WHERE:", whereClause);
    console.log("SQL Replacements:", replacements);

    // ============================================
    // COUNT QUERY
    // ============================================
    const countQuery = `
      SELECT COUNT(*) as total
      FROM games
      ${whereClause}
    `;

    // ============================================
    // DATA QUERY
    // ============================================
    const dataQuery = `
      SELECT 
        id,
        name,
        description,
        "genre",
        "imageUrl",
        "gameUrl",
        "rating",
        "isActive",
        "createdAt",
        "updatedAt",
        "deletedAt"
      FROM games
      ${whereClause}
      ORDER BY "createdAt" DESC
      LIMIT :limit
      OFFSET :offset
    `;

    replacements.limit = limit;
    replacements.offset = offset;

    // ============================================
    // EXECUTE QUERIES
    // ============================================
    try {
      const [countResult] = await this.db.sequelize.query(countQuery, {
        replacements,
        type: QueryTypes.SELECT
      });

      const games = await this.db.sequelize.query(dataQuery, {
        replacements,
        type: QueryTypes.SELECT
      });

      const total = parseInt(countResult.total);

      return { 
        meta: { 
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }, 
        games 
      };
    } catch (error) {
      console.error("SQL Query Error:", error);
      throw error;
    }
  }
}

export default GetAllGamesService;