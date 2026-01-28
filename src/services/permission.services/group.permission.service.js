import { BaseService } from "../base.service.js";
import PermissionRepository from "../../dbOperation/permission.repository.js";

class GroupPermissionService extends BaseService {
  async run() {
    const allGroupedPermission =
      await PermissionRepository.getGroupedPermissions({
        attributes: ["id", "key", "description"],
        order: [["key", "ASC"]],
      });
    if (!allGroupedPermission) {
      throw new this.error("No permission found", this.httpStatus.NOT_FOUND);
    }
    return allGroupedPermission;
  }
}

export default GroupPermissionService;
