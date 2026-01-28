import { BaseService } from "../base.service.js";

class DeleteService extends BaseService {
  async run() {
    const { id } = this.args;

    const game = await this.db.game.findByPk(id);
    if (!game) {
      throw this.error("Game not found", this.httpStatus.NOT_FOUND);
    }

    await game.destroy(); // ✅ sets deleted_at (UTC)

    return {
      id: game.id,
      deletedAt: game.deletedAt,
      message: "Game deleted successfully",
    };
  }
}

export default DeleteService;
