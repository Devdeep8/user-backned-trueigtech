import { BaseService } from "../base.service.js";
import roleRepository from "../../dbOperation/role.repository.js";

class GetRoleWithPermissionsService extends BaseService {
  async run() {
    const getRolesWithPermissions = await roleRepository.roleWithPermissions();
    if (!getRolesWithPermissions) {
      throw new this.error("Roles not found", this.httpStatus.NOT_FOUND);
    }
    return getRolesWithPermissions;
  }
}

export default GetRoleWithPermissionsService;
