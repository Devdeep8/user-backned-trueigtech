import { BaseService } from "../base.service.js";
import PermissionRepository from "../../dbOperation/permission.repository.js";

class DeletePermissionService extends BaseService {
  async run() {
    const { id } = this.args;
    if (!id) {
      throw new this.error(
        "Permission ID is required",
        this.httpStatus.BAD_REQUEST,
      );
    }
    return await PermissionRepository.deletePermission(id);
  }
}

export default DeletePermissionService;
