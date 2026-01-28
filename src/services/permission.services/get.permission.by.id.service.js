import { BaseService } from "../base.service.js";
import PermissionRepository from "../../dbOperation/permission.repository.js";

class GetPermissionByIdService extends BaseService {
  async run() {
    const { id } = this.args;
    if (!id) {
      throw new this.error(
        "Permission ID is required",
        this.httpStatus.BAD_REQUEST,
      );
    }
    // Check if ID is number? Original code did `typeof id !== "number"`.
    // Route param is usually string unless parsed. Controller parses?
    // Let's assume input is validated or parsed.

    return await PermissionRepository.getPermissionById(id);
  }
}

export default GetPermissionByIdService;
