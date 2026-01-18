/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('games', 'rating', {
    type: Sequelize.DECIMAL(3, 2),
    allowNull: true,
    defaultValue: 0.00,
    comment: 'Average rating of the game (0.00 to 5.00)'
  });

  // Add index for better query performance
  await queryInterface.addIndex('games', ['rating']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('games', 'rating');
}