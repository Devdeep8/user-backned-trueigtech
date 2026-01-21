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
}
