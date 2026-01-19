import { Role } from "../model/index.js";
class RoleRepository {
    constructor() {
        this.Role = Role;
    }
    async getRoleByIdentifier(where){
    
        return await this.Role.findOne({where})
    }


    async getAllRoles(){
        return await this.Role.findAll()
    }
    
    async getRoleById(id){
        return await this.Role.findByPk(id)
    }
    
    async createRole(data){
        return await this.Role.create(data)
    }
    
    async updateRole(id,data){
        return await this.Role.update(data,{where:{id}})
    }
    

}

export default new RoleRepository();
