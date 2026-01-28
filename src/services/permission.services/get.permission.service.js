import { BaseService } from "../base.service.js";

class GetPermissionService extends BaseService {
  async run() {
    return await this.db.permission.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt" , "description"],
      },
    });
  }
}

export default GetPermissionService;
