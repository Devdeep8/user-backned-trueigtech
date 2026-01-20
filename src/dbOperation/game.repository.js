// dbOperation/game.repository.js
import { Games } from "../model/game.model.js";

class GameRepository {
  constructor() {
    this.model = Games;
  }

  /**
   * Create a single game record
   * @param {Object} data - Game data
   * @returns {Promise<Object>} Created game
   */
  async createGameRecord(data) {
    return await this.model.create(data);
  }

  /**
   * Bulk create multiple games
   * @param {Array} games - Array of game objects
   * @returns {Promise<Array>} Created games
   */
  async bulkCreateGames(games) {
    return await this.model.bulkCreate(games, { validate: true });
  }

  /**
   * Update a game by ID
   * @param {String} id - Game ID
   * @param {Object} data - Data to update
   * @returns {Promise<Number>} Number of affected rows
   */
  async updateGameById(id, data) {
    const [affectedRows] = await this.model.update(data, { where: { id } });
    return affectedRows;
  }

  /**
   * Toggle isActive status of a game
   * @param {String} id - Game ID
   * @returns {Promise<Number>} Number of affected rows
   */
  async toggleActive(id) {
    // First, fetch the current game to get its isActive status
    const game = await this.model.findByPk(id);
    
    if (!game) {
      return 0;
    }

    const [affectedRows] = await this.model.update(
      { isActive: !game.isActive },
      { where: { id } }
    );
    
    return affectedRows;
  }

  /**
   * Soft delete a game
   * @param {String} id - Game ID
   * @returns {Promise<Array>} Update result
   */
  async softDeleteGame(id) {
    return await this.model.update(
      { deletedAt: new Date() },
      { where: { id } }
    );
  }

  /**
   * Find all games with options
   * @param {Object} options - Sequelize query options
   * @returns {Promise<Object>} Games with count
   */
  async findAllGames(options = {}) {
    return await this.model.findAndCountAll(options);
  }

  /**
   * Find a game by ID
   * @param {String} id - Game ID
   * @returns {Promise<Object|null>} Game or null
   */
  async findById(id) {
    return await this.model.findByPk(id);
  }

  /**
   * Find one game by conditions
   * @param {Object} whereCondition - Where clause
   * @returns {Promise<Object|null>} Game or null
   */
  async findOne(whereCondition) {
    return await this.model.findOne({ where: whereCondition });
  }

  /**
   * Count games with conditions
   * @param {Object} whereCondition - Where clause
   * @returns {Promise<Number>} Count
   */
  async count(whereCondition = {}) {
    return await this.model.count({ where: whereCondition });
  }

  /**
   * Hard delete a game (permanent)
   * @param {String} id - Game ID
   * @returns {Promise<Number>} Number of deleted rows
   */
  async hardDelete(id) {
    return await this.model.destroy({ where: { id }, force: true });
  }

  /**
   * Restore a soft-deleted game
   * @param {String} id - Game ID
   * @returns {Promise<Array>} Update result
   */
  async restore(id) {
    return await this.model.update(
      { deletedAt: null },
      { where: { id } }
    );
  }
}

// Export a singleton instance
export default new GameRepository();