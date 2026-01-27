import { BaseService } from "../base.service.js";

class DeleteService extends BaseService{

    async run(){
        const { id } = this.args;
        const game = await this.db.game.findByPk(id);
        if(!game){
            throw this.error("Game not found" , 404);
        }
        const result = await game.update({ deletedAt: new Date() , isActive: false });
        if(!result){
            throw this.error("Game not deleted" ,500 );
        }
        return result;
    }
}

export default DeleteService;