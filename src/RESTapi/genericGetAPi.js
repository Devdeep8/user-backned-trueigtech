// src/services/generic/get.service.js
import { BaseService } from "../services/base.service.js";
import { Op } from "sequelize";

export class GenericGetService extends BaseService {
 async buildQuery(backendFilters = {}) {
    const { filter = {}, search, sort, pagination, dateRange } = this.args;
    const { user } = this.context;

    // Mandatory backend filters (entity-specific)
    let where = { ...backendFilters, ...filter };

    // Role-based rule
    if (user?.role === "user" && backendFilters.isActive === undefined) {
      where.isActive = true;
    }

    // Soft delete always applied
    where.deletedAt = null;

    // Search filter
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    // Date range filter
    if (dateRange) {
      where.createdAt = { [Op.between]: [dateRange.from, dateRange.to] };
    }

    // // Sorting
    // const order = sort
    //   ? [[Object.keys(sort)[0], Object.values(sort)[0]]]
    //   : [["createdAt", "DESC"]];

    // Pagination
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const offset = (page - 1) * limit;

    return { where, page, limit, offset };
  }
  async buildSqlWhere(where) {
    const conditions = [];
    const replacements = {};

    Object.entries(where).forEach(([key, value]) => {
      // NULL check
      if (value === null) {
        conditions.push(`${key} IS NULL`);
        return;
      }

      // Operators
      if (typeof value === "object") {
        if (value[Op.iLike]) {
          conditions.push(`${key} ILIKE :${key}`);
          replacements[key] = value[Op.iLike];
          return;
        }

        if (value[Op.between]) {
          conditions.push(`${key} BETWEEN :${key}From AND :${key}To`);
          replacements[`${key}From`] = value[Op.between][0];
          replacements[`${key}To`] = value[Op.between][1];
          return;
        }
      }

      // Normal equality
      conditions.push(`${key} = :${key}`);
      replacements[key] = value;
    });

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    return { whereClause, replacements };
  }
   async buildPaginatedSqlQuery({
    table,
    where,
    page = 1,
    limit = 10,
    orderBy = { createdAt: "DESC" },
    columns = ["*"], // optional: select specific columns
  }) {
    const offset = (page - 1) * limit;

    /* 1️⃣ WHERE */
    const { whereClause, replacements } = await this.buildSqlWhere(where);

    /* 2️⃣ SELECT columns */
    const selectColumns =
      columns[0] === "*"
        ? "*"
        : columns.map((c) => `"${c}"`).join(", ");

    /* 3️⃣ ORDER BY (safe backend-controlled) */
    const orderClause = Object.entries(orderBy)
      .map(([key, value]) => `"${key}" ${value.toUpperCase()}`)
      .join(", ");

    /* 4️⃣ COUNT QUERY */
    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM "${table}"
      ${whereClause}
    `;

    const [{ total }] = await this.db.sequelize.query(countQuery, {
      replacements,
      type: QueryTypes.SELECT,
    });

    /* 5️⃣ DATA QUERY */
    const dataQuery = `
      SELECT ${selectColumns}
      FROM "${table}"
      ${whereClause}
      ORDER BY ${orderClause}
      LIMIT :limit OFFSET :offset
    `;

    const data = await this.db.sequelize.query(dataQuery, {
      replacements: {
        ...replacements,
        limit,
        offset,
      },
      type: QueryTypes.SELECT,
    });

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data,
    };
  }
}
