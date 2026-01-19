import { User, Role, Permission } from "./src/model/index.js";
import { sequelize } from "./src/config/db.js";

async function verify() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    // 1. Check Roles
    const roles = await Role.findAll({
      include: [
        {
          model: Permission,
          as: "permissions", // Check alias from index.js
        },
      ],
    });
    console.log(`Found ${roles.length} roles.`);
    roles.forEach((r) => {
      console.log(`- Role: ${r.name}, Permissions: ${r.permissions.length}`);
      r.permissions.forEach((p) => console.log(`  * ${p.key}`));
    });

    if (roles.length === 0) {
      console.warn("!! NO ROLES FOUND. Seeding might have failed.");
    }

    // 2. Check User Association
    const user = await User.findOne({
      include: [
        {
          model: Role,
          as: "userRole", // Check alias from index.js
        },
      ],
    });

    if (user) {
      console.log(`Found a User: ${user.email}`);
      console.log(`- roleId: ${user.roleId}`);
      console.log(
        `- Role Association: ${user.userRole ? user.userRole.name : "NULL (Association working but no role assigned)"}`,
      );
    } else {
      console.log("No users found to test association.");
    }
  } catch (err) {
    console.error("Verification Failed:", err);
  } finally {
    await sequelize.close();
  }
}

verify();
