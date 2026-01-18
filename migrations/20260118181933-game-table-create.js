/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('games', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    genre: {
      type: Sequelize.STRING,
      allowNull: true
    },
    imageUrl: {
      type: Sequelize.STRING(500),
      allowNull: true
    },
    gameUrl: {
      type: Sequelize.STRING(500),
      allowNull: false
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    deletedAt: {
      type: Sequelize.DATE,
      allowNull: true
    }
  });

  // Add indexes for better performance
  await queryInterface.addIndex('games', ['name']);
  await queryInterface.addIndex('games', ['genre']);
  await queryInterface.addIndex('games', ['isActive']);
  await queryInterface.addIndex('games', ['deletedAt']); // Important for paranoid queries
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('games');
}