// dbOperation/game.repository.js
import { Games } from "../model/game.model.js";

export async function createGameRecord(data) {
  return await Games.create(data);
}

export async function bulkCreateGames(games) {
  return await Games.bulkCreate(games, { validate: true });
}

export async function updateGameById(id, data) {
  const [affectedRows] = await Games.update(data, { where: { id } });
  return affectedRows;
}

export async function findGameById(id) {
  return await Games.findByPk(id);
}

export async function softDeleteGame(id) {
  return await Games.update({ deletedAt: new Date() }, { where: { id } });
}

export async function findAllGames(where, limit, offset) {
  return await Games.findAndCountAll({ where, limit, offset });
}
