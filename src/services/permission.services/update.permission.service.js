import { BaseService } from "../base.service.js";
import PermissionRepository from "../../dbOperation/permission.repository.js";

class UpdatePermissionService extends BaseService {
  async run() {
    const { id, data } = this.args;
    if (!id) {
      throw new this.error(
        "Permission ID is required",
        this.httpStatus.BAD_REQUEST,
      );
    }
    if (!data) {
      throw new this.error(
        "Permission data is required",
        this.httpStatus.BAD_REQUEST,
      );
    }
    return await PermissionRepository.updatePermission(id, data);
  }
}

export default UpdatePermissionService;
