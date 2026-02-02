/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  // 1. Remove the column
  await queryInterface.removeColumn("users", "role");

  // 2. Drop ENUM type (Postgres only)
  await queryInterface.sequelize.query(`
    DROP TYPE IF EXISTS "enum_users_role";
  `);
}

export async function down(queryInterface, Sequelize) {
  // Re-create the column if rollback needed
  await queryInterface.addColumn("users", "role", {
    type: Sequelize.ENUM("admin", "user"),
    defaultValue: "user",
    allowNull: false,
  });
}
