import { BaseService } from "../base.service.js";
import PermissionRepository from "../../dbOperation/permission.repository.js";

class GetPermissionService extends BaseService {
  async run() {
    return await PermissionRepository.getAllPermissions();
  }
}

export default GetPermissionService;
