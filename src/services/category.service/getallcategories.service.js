// src/services/category.services/getAllCategories.service.js
import { GenericGetService } from "../../RESTapi/genericGetAPi.js";

export class GetAllCategoriesService extends GenericGetService {
  async run() {
    // Optional: access user from context if needed
    const { user } = this.context;


    // Backend filters placeholder (you can add filters here later)
    const backendFilters = {};

    // Build query: where, order, pagination
    const { where, order, page, limit, offset } = this.buildQuery(backendFilters);

    // Fetch categories from DB
    const { count, rows: categories } = await this.db.category.findAndCountAll({
        where : where ,
      limit: limit ?? 20,
      offset: offset ?? 0,
      order: order?.length ? order : [["createdAt", "DESC"]], // default order
       attributes: {
    exclude: ["createdAt", "updatedAt", "deletedAt", "description"],
  },
    });
    if (!categories){
       throw new this.error("Categoreis not found" , this.httpStatus.INTERNAL_SERVER_ERROR , {type : "pta nhi" , cause : "getapi error"})
    }

    // Return data in a structured format
    return {
      total: count,
      page: page ?? 1,
      limit: limit ?? 20,
      categories,
    };
  }
}
