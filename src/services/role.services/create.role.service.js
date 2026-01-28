import { BaseService } from "../base.service.js";
import roleRepository from "../../dbOperation/role.repository.js";

const ROLE_HIERARCHY = {
  super_admin: 4,
  admin: 3,
  manager: 2,
  staff: 1,
  user: 0,
};

class CreateRoleService extends BaseService {
  async run() {
    const { data } = this.args;
    const { user } = this.context;

    // Requester Role
    const requesterRole = user?.role; // Assuming user object has role property from auth middleware

    if (!data) {
      throw new this.error("Invalid data", this.httpStatus.BAD_REQUEST);
    }

    // Hierarchy Check
    const requesterRank = ROLE_HIERARCHY[requesterRole] || 0;
    const targetRank = ROLE_HIERARCHY[data.name] || 0;

    if (requesterRank < targetRank) {
      throw new this.error(
        "You cannot create a role higher than your own",
        this.httpStatus.FORBIDDEN,
      );
    }

    if (requesterRole !== "super_admin" && requesterRank <= targetRank) {
      throw new this.error(
        "You cannot create a role equal to or higher than your own",
        this.httpStatus.FORBIDDEN,
      );
    }

    const role = await roleRepository.getRoleByIdentifier({ name: data.name });
    if (role) {
      throw new this.error("Role already exists", this.httpStatus.CONFLICT);
    }

    return await roleRepository.createRole(data);
  }
}

export default CreateRoleService;
