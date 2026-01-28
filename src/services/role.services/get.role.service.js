import { BaseService } from "../base.service.js";
import roleRepository from "../../dbOperation/role.repository.js";

class GetRoleService extends BaseService {
  async run() {
    const allRoles = await roleRepository.getAllRoles();
    if (!allRoles || !allRoles.length) {
      throw new this.error("Roles not found", this.httpStatus.NOT_FOUND);
    }
    return allRoles;
  }
}

export default GetRoleService;
