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

    

}
export default new RoleController();