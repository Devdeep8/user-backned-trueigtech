import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface, Sequelize) {
  const permissionsList = [
    // Game Permissions
    { key: "game.create", description: "Create games" },
    { key: "game.read", description: "View games" },
    { key: "game.update", description: "Update games" },
    { key: "game.delete", description: "Delete games" },

    // User Permissions
    { key: "user.create", description: "Create users" },
    { key: "user.read", description: "View users" },
    { key: "user.update", description: "Update users" },
    { key: "user.delete", description: "Delete users" },

    // Role Permissions
    { key: "role.create", description: "Create roles" },
    { key: "role.read", description: "View roles" },
    { key: "role.update", description: "Update roles" },
    { key: "role.delete", description: "Delete roles" },

    // Permission Permissions
    { key: "permission.read", description: "View permissions" },
    { key: "permission.assign", description: "Assign permissions to roles" },
  ];

  const permissions = permissionsList.map((p) => ({
    id: uuidv4(),
    ...p,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await queryInterface.bulkInsert("permissions", permissions);

  // Fetch Roles to associate
  const [roles] = await queryInterface.sequelize.query(
    `SELECT id, name FROM roles;`,
  );

  const roleMap = {};
  roles.forEach((r) => (roleMap[r.name] = r.id));

  const rolePermissions = [];

  // Helper to find permission ID
  const getPermId = (key) => permissions.find((p) => p.key === key)?.id;

  // 1. Super Admin: ALL Permissions
  if (roleMap["super_admin"]) {
    permissions.forEach((p) => {
      rolePermissions.push({
        roleId: roleMap["super_admin"],
        permissionId: p.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: uuidv4(), // Adding ID because migration added explicit PK
      });
    });
  }

  // 2. Admin: User + Role + Permission Management
  if (roleMap["admin"]) {
    const adminKeys = [
      "user.create",
      "user.read",
      "user.update",
      "user.delete",
      "role.create",
      "role.read",
      "role.update",
      "role.delete",
      "permission.read",
      "permission.assign",
      "game.read",
    ];
    adminKeys.forEach((k) => {
      const pid = getPermId(k);
      if (pid)
        rolePermissions.push({
          roleId: roleMap["admin"],
          permissionId: pid,
          createdAt: new Date(),
          updatedAt: new Date(),
          id: uuidv4(),
        });
    });
  }

  // 3. Manager: Game Management + User Read
  if (roleMap["manager"]) {
    const managerKeys = [
      "game.create",
      "game.read",
      "game.update",
      "game.delete",
      "user.read",
    ];
    managerKeys.forEach((k) => {
      const pid = getPermId(k);
      if (pid)
        rolePermissions.push({
          roleId: roleMap["manager"],
          permissionId: pid,
          createdAt: new Date(),
          updatedAt: new Date(),
          id: uuidv4(),
        });
    });
  }

  // 4. User/Staff: Game Read
  if (roleMap["user"]) {
    const pid = getPermId("game.read");
    if (pid)
      rolePermissions.push({
        roleId: roleMap["user"],
        permissionId: pid,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: uuidv4(),
      });
  }

  if (rolePermissions.length > 0) {
    await queryInterface.bulkInsert("RolePermissions", rolePermissions);
  }
}

export async function down(queryInterface, Sequelize) {
  const keys = [
    "game.create",
    "game.read",
    "game.update",
    "game.delete",
    "user.create",
    "user.read",
    "user.update",
    "user.delete",
    "role.create",
    "role.read",
    "role.update",
    "role.delete",
    "permission.read",
    "permission.assign",
  ];

  // Delete associations first (if no cascade)
  // Detailed deletion is tricky without IDs, but we can rely on verifying DB later or using cascade.
  // For specific keys:
  await queryInterface.bulkDelete("permissions", { key: keys }, {});
}
