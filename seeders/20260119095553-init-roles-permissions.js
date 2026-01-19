import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface, Sequelize) {
  const roles = [
    {
      id: uuidv4(),
      name: "admin",
      description: "Administrator with full access",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      name: "user",
      description: "Standard user",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const permissions = [
    {
      id: uuidv4(),
      key: "manage_users",
      description: "Can manage users",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      key: "view_content",
      description: "Can view content",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await queryInterface.bulkInsert("roles", roles);
  await queryInterface.bulkInsert("permissions", permissions);

  // Assign 'manage_users' to 'admin'
  const rolePermissions = [
    {
      roleId: roles[0].id, // admin
      permissionId: permissions[0].id, // manage_users
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      roleId: roles[0].id, // admin
      permissionId: permissions[1].id, // view_content
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      roleId: roles[1].id, // user
      permissionId: permissions[1].id, // view_content
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await queryInterface.bulkInsert("RolePermissions", rolePermissions);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("RolePermissions", null, {});
  await queryInterface.bulkDelete("permissions", null, {});
  await queryInterface.bulkDelete("roles", null, {});
}
