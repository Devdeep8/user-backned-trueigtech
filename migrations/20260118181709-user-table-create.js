/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('users', {
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
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    role: {
      type: Sequelize.ENUM('admin', 'user'),
      defaultValue: 'user',
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    refreshToken: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    refreshTokenExpiresAt: {
      type: Sequelize.DATE,
      allowNull: true
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
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
  await queryInterface.addIndex('users', ['email'], {
    unique: true,
    name: 'users_email_unique'
  });
  await queryInterface.addIndex('users', ['role']);
  await queryInterface.addIndex('users', ['isActive']);
  await queryInterface.addIndex('users', ['deletedAt']);
}

export async function down(queryInterface, Sequelize) {
  // Drop table
  await queryInterface.dropTable('users');
  // Drop ENUM type
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
}