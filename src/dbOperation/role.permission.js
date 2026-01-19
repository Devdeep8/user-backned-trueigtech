class rolePermissionRepository {
    async createRolePermission(roleId , permissionId) {
        return await RolePermission.create({
            role_id: roleId,
            permission_id: permissionId,
        });
    }

    async removeRolePermission(roleId , permissionId) {
        return await RolePermission.destroy({
            where: {
                role_id: roleId,
                permission_id: permissionId,
            },
        });
    }
    async getRolePermission(roleId , permissionId) {
        return await RolePermission.findOne({
            where: {
                role_id: roleId,
                permission_id: permissionId,
            },
        });
    }

    async getAllRolePermission() {
        return await RolePermission.findAll({
        });
        
    }

    async upadateRolePermission(roleId , permissionId) {
        return await RolePermission.update({
            role_id: roleId,
            permission_id: permissionId,
        }, {
            where: {
                role_id: roleId,
                permission_id: permissionId,
            },
        });
    }

}