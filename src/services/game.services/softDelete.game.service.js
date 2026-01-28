import { BaseService } from "../base.service.js";

class DeleteService extends BaseService{

    async run(){
        const { id } = this.args;
        const game = await this.db.game.findByPk(id);
        if(!game){
            throw this.error("Game not found" , this.httpStatus.NOT_FOUND);
        }
        const result = await game.update({ deletedAt: new Date() , isActive: false });
        if(!result){
            throw this.error("Game not deleted" ,this.httpStatus.INTERNAL_SERVER_ERROR );
        }
        return result;
    }
}

export default DeleteService;