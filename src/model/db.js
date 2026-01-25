// src/models/index.js
import { User } from "./user.model.js";
import { Games } from "./game.model.js";
import { Role } from "./role.model.js";
import { Permission } from "./permission.model.js";
import { sequelize } from "../config/db.js";

// Create a single db object
const db = {
  user: User,
  game: Games,
  role: Role,
  permission: Permission,
  sequelize: sequelize
};

export default db;
