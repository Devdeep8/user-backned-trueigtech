import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface, Sequelize) {
  const roles = [
    {
      id: uuidv4(),
      name: "manager",
      description: "Manager with access to specific resources",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const permissions = [
    {
      id: uuidv4(),
      key: "manage_games",
      description: "Can create, read, update, delete games",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await queryInterface.bulkInsert("roles", roles);
  await queryInterface.bulkInsert("permissions", permissions);

  // Assign 'manage_games' to 'manager'
  const rolePermissions = [
    {
      roleId: roles[0].id, // manager
      permissionId: permissions[0].id, // manage_games
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await queryInterface.bulkInsert("RolePermissions", rolePermissions);
}

export async function down(queryInterface, Sequelize) {
  // We should ideally only delete what we added, but finding specific IDs is hard without queries.
  // For safety, we might leave them or try to delete by name.

  // Deleting by sub-query (cleaner approach if supported by raw query, but bulkDelete allows where)
  await queryInterface.bulkDelete("roles", { name: "manager" }, {});
  await queryInterface.bulkDelete("permissions", { key: "manage_games" }, {});
  // RolePermissions cascade delete usually, or we can manual delete.
  // Since we don't have the IDs easily here without a select, letting the foreign key cascade (if set) handle it
  // or just leaving orphan junction records (less ideal) is common in simple seeders.
  // However, let's try to be cleaner if possible.
  // For now, removing the Role and Permission entities is the main goal.
}
