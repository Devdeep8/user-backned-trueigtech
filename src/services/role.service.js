import roleRepository from "../dbOperation/role.repository.js";
import AppError from "../utils/appError.js";

class RoleService {
  async getAllRoles() {
    return await roleRepository.getAllRoles();
  }

  async createRole(data) {
    if (!data) {
      throw new AppError("Invalid data", 400);
    }
    const role = await roleRepository.getRoleByIdentifier({ name: data.name });
    if (role) {
      throw new AppError("Role already exists", 409);
    }

    return await roleRepository.createRole(data);
  }

  async updateRole(id,data){
    if (!id || !data) {
      throw new AppError("Invalid data", 400);
    }
    const role = await roleRepository.getRoleByIdentifier({ name: data.name });
    if (!role) {
      throw new AppError("Role not found", 404);
    }
    return await roleRepository.updateRole(id,data);
  }
}
export default new RoleService();
