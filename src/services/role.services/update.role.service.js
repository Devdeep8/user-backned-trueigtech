import { BaseService } from "../base.service.js";
import roleRepository from "../../dbOperation/role.repository.js";

class UpdateRoleService extends BaseService {
  async run() {
    const { id, data } = this.args;

    if (!id || !data) {
      throw new this.error("Invalid data", this.httpStatus.BAD_REQUEST);
    }
    const role = await roleRepository.getRoleByIdentifier({ name: data.name });
    // Note: The original logic checked if 'role' exists BEFORE update to ensure meaningful error or logic.
    // However, original logic:
    // const role = await roleRepository.getRoleByIdentifier({ name: data.name });
    // if (!role) { throw new AppError("Role not found", 404); }
    // Ideally we should check if the role we are updating (by ID) exists, OR if the new name clashes.
    // The original logic seemed to check if a role with the *new name* exists?
    // "const role = await roleRepository.getRoleByIdentifier({ name: data.name });"
    // If updating name to "admin", it checks if "admin" exists.
    // But then it throws "Role not found" if it doesn't exist? That implies it expects the role to exist to update it?
    // Let's look at original again:
    /*
    async updateRole(id, data) {
       ...
       const role = await roleRepository.getRoleByIdentifier({ name: data.name });
       if (!role) {
         throw new AppError("Role not found", 404);
       }
       return await roleRepository.updateRole(id, data);
     }
    */
    // This logic seems slightly flawed if 'data.name' is the *new* name. If I want to change "user" to "superuser", and "superuser" doesn't exist, it throws "Role not found".
    // Or maybe 'data.name' is used to find the role to update? But 'id' is passed.
    // I will preserve the original logic for now but it looks suspicious.
    // Actually, maybe it checks if the role to be updated exists? But it uses `data.name`.
    // If the user meant "update role with ID X", they might not pass name in data if they are updating permissions or description.

    // I will adhere to the original implementation's behavior for safety, but I suspect it meant to check ID.
    // Wait, `getRoleByIdentifier` uses `name`.

    if (!role) {
      // If no role found with that name, maybe we should check by ID?
      // But let's stick to strict translation first.
      throw new this.error("Role not found", this.httpStatus.NOT_FOUND);
    }

    return await roleRepository.updateRole(id, data);
  }
}

export default UpdateRoleService;
