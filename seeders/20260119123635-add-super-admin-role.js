import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface, Sequelize) {
  // 1. Create Super Admin Role
  const superAdminId = uuidv4();
  await queryInterface.bulkInsert("roles", [
    {
      id: superAdminId,
      name: "super_admin",
      description: "Super Administrator with ALL permissions",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // 2. Fetch ALL existing permissions
  // We need to use raw query because we can't easily import models in seeders without setup
  // SELECT id FROM permissions;
  const [permissions] = await queryInterface.sequelize.query(
    `SELECT id FROM permissions;`,
  );

  if (permissions.length > 0) {
    // 3. Create associations for ALL permissions
    const rolePermissions = permissions.map((p) => ({
      roleId: superAdminId,
      permissionId: p.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("RolePermissions", rolePermissions);
  }
}

export async function down(queryInterface, Sequelize) {
  // Delete the role (Cascading deletes usually handle junction table, but Sequelize migration often needs manual cleanup if no cascade)
  // Safest: Delete RolePermissions for this role first, then Role.

  // Find role ID first? Or just delete by inner join logic.
  // Simpler: Delete by subquery.

  // Delete associations
  await queryInterface.sequelize.query(
    `DELETE FROM "RolePermissions" WHERE "roleId" IN (SELECT id FROM roles WHERE name = 'super_admin');`,
  );

  // Delete Role
  await queryInterface.bulkDelete("roles", { name: "super_admin" }, {});
}
