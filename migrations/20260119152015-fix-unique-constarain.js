"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    /* 1️⃣ Drop existing composite primary key */
    await queryInterface.sequelize.query(`
      ALTER TABLE "RolePermissions"
      DROP CONSTRAINT IF EXISTS "RolePermissions_pkey";
    `);

    /* 2️⃣ Add id column (ALLOW NULL FIRST) */
    await queryInterface.addColumn("RolePermissions", "id", {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: Sequelize.UUIDV4,
    });

    /* 3️⃣ Backfill UUIDs for existing rows */
    await queryInterface.sequelize.query(`
      UPDATE "RolePermissions"
      SET id = gen_random_uuid()
      WHERE id IS NULL;
    `);

    /* 4️⃣ Make id NOT NULL */
    await queryInterface.changeColumn("RolePermissions", "id", {
      type: Sequelize.UUID,
      allowNull: false,
    });

    /* 5️⃣ Make id PRIMARY KEY */
    await queryInterface.addConstraint("RolePermissions", {
      fields: ["id"],
      type: "primary key",
      name: "RolePermissions_id_pkey",
    });

    /* 6️⃣ Add unique constraint on roleId + permissionId */
    await queryInterface.addConstraint("RolePermissions", {
      fields: ["roleId", "permissionId"],
      type: "unique",
      name: "role_permission_unique",
    });
  },

  async down(queryInterface, Sequelize) {
    /* Remove unique constraint */
    await queryInterface.removeConstraint(
      "RolePermissions",
      "role_permission_unique"
    );

    /* Remove id primary key */
    await queryInterface.removeConstraint(
      "RolePermissions",
      "RolePermissions_id_pkey"
    );

    /* Remove id column */
    await queryInterface.removeColumn("RolePermissions", "id");

    /* Restore composite primary key */
    await queryInterface.addConstraint("RolePermissions", {
      fields: ["roleId", "permissionId"],
      type: "primary key",
      name: "RolePermissions_pkey",
    });
  },
};
