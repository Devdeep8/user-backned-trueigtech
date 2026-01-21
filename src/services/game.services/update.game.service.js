import { BaseService } from "../base.service.js";

class UpdateGameService extends BaseService {
  constructor(error, args, context, db) {
    super(error, args, context, db);
  }
  async run() {
    const { data, id } = this.args;
    const game = await this.db.game.findByPk(id);
    if (!game){
        throw this.error("Game not found" , 404);
    }
    const result = await game.update(data)
    
    if(!result){
        throw this.error("Game not updated" ,500 );
    }

    return result;
  }
}

export default  UpdateGameService;