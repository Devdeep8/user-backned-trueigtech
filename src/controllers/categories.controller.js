import { httpStatus } from "../helper/http-status.js";
import { GetAllCategoriesService } from "../services/category.service/getallcategories.service.js";

class CategoreisController {
  async getAllCategories(req, res, next) {

    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const genre = req.query.genre || null;
      const search = req.query.search || null;
      const sortBy = req.query.sortBy || null;
      const sortOrder = req.query.sortOrder || null;

      const pagination = { page, limit };
      const dateFrom = req.query.dateFrom || null;
      const dateTo = req.query.dateTo || null;
      let dateRange;
      if (dateFrom && dateTo) {
        dateRange = { dateFrom, dateTo };
      }

      const filter = {};
      if (genre) filter.genre = genre;

      const sort = {};
      if (sortBy) sort.by = sortBy;
      if (sortOrder) sort.order = sortOrder;

      const context = {
        user: req.user, // from auth middleware
        requestId: req.requestId,
      };



      const getAllCategoriesService = new GetAllCategoriesService( { filter, search, sort,pagination, dateRange }, context);
      const result = await getAllCategoriesService.execute()
      return res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error);
    }
  }
}


export default new CategoreisController()
