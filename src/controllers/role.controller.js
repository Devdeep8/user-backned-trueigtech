import roleService from "../services/role.service.js";

class RoleController {
    async getAllRoles(req,res,next){
        try {
            const roles = await roleService.getAllRoles();
            return res.status(200).json({
                success: true,
                message: "Roles retrieved successfully",
                data: {
                    roles,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async createRole(req,res,next){
        try {
            const role = await roleService.createRole(req.body);
            return res.status(201).json({
                success: true,
                message: "Role created successfully",
                data: {
                    role,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async updateRole(req,res,next){
        try {
            const role = await roleService.updateRole(req.params.id,req.body);
            return res.status(200).json({
                success: true,
                message: "Role updated successfully",
                data: {
                    role,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async roleWithPermissions(req,res,next){
        try {
            const rolesWithPermissions = await roleService.roleWithPermissions();
            return res.status(200).json({
                success: true,
                message: "Roles with permissions retrieved successfully",
                data: {
                    rolesWithPermissions,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async createRolePermission(req,res,next){
        const {roleId} = req.params;
        const {permissionId} = req.body;
        try {
            const rolePermission = await roleService.createRolePermission(roleId,permissionId);
            return res.status(201).json({
                success: true,
                message: "Role permission created successfully",
                data: {
                    rolePermission,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteRolePermission(req,res,next){
        const { roleId , permissionId} = req.params;
        try {
            const rolePermission = await roleService.deleteRolePermission(roleId , permissionId);
            return res.status(200).json({
                success: true,
                message: "Role permission deleted successfully",
                data: {
                    rolePermission,
                },
            });
        } catch (error) {
            next(error);
        }
    }


    

}
export default new RoleController();