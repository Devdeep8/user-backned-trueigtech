// seeders/20260202-seed-categories.js
import { v4 as uuidv4 } from "uuid";

export default {
  up: async (queryInterface, Sequelize) => {
    const categories = [
      "Simulation",
      "Arcade",
      "Sports",
      "Horror",
      "Racing",
      "Action",
      "Battle Royale",
      "Survival Horror",
      "Adventure",
      "RPG",
      "Puzzle",
      "Strategy",
    ];

    // Insert categories with UUIDs
    const categoryRows = categories.map((name) => ({
      id: uuidv4(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("categories", categoryRows);

    // Now update games table to set categoryId based on old genre column
    for (const row of categoryRows) {
      await queryInterface.sequelize.query(
        `UPDATE games SET "categoryId" = '${row.id}' WHERE genre ILIKE '${row.name}'`
      );
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("games", null, {}); // optional: remove categoryIds if needed
    await queryInterface.bulkDelete("categories", null, {});
  },
};
