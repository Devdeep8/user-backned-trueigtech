// migrations/20260202-create-category-and-add-categoryid-to-games.js
export default {
  up: async (queryInterface, Sequelize) => {
    // 1️⃣ Create categories table
    await queryInterface.createTable("categories", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("NOW()") },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("NOW()") },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });

    // 2️⃣ Add categoryId column to games table
    await queryInterface.addColumn("games", "categoryId", {
      type: Sequelize.UUID,
      allowNull: true, // temporarily nullable
      references: { model: "categories", key: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    // 3️⃣ Add index for faster queries
    await queryInterface.addIndex("games", ["categoryId"]);
  },

  down: async (queryInterface) => {
    // Reverse operations
    await queryInterface.removeIndex("games", ["categoryId"]);
    await queryInterface.removeColumn("games", "categoryId");
    await queryInterface.dropTable("categories");
  },
};
