import { BaseService } from "../base.service.js";

class UpdateGameService extends BaseService {
  async run() {
    const { data, id } = this.args;
    if (!id || !data) {
      throw new this.error(
        "Game ID or data is missing",
        this.httpStatus.BAD_REQUEST,
      );
    }
    if (!this.context.user.role) {
      throw new this.error("Role is missing", this.httpStatus.BAD_REQUEST);
    }
    const game = await this.db.game.findByPk(id);

    if (!game) {
      throw new this.error("Game not found", this.httpStatus.NOT_FOUND);
    }

    const result = await game.update(data.data);

    if (!result) {
      throw new this.error(
        "Game not updated",
        this.httpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      game: result,
    };
  }
}

export default UpdateGameService;
