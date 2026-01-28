import { BaseService } from "../base.service.js";
import PermissionRepository from "../../dbOperation/permission.repository.js";

class CreatePermissionService extends BaseService {
  async run() {
    const { data } = this.args;
    if (!data) {
      throw new this.error(
        "Permission data is required",
        this.httpStatus.BAD_REQUEST,
      );
    }
    return await PermissionRepository.createPermission(data);
  }
}

export default CreatePermissionService;
