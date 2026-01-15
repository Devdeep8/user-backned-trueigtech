// models/Game.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
export const Games = sequelize.define('Game', {
    // 1. ID (handled by Sequelize by default, but explicit here)
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    // 2. Name
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // 3. Description
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    // 4. Genre
    genre: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // 5. Image URL
    imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    // 6. Game URL (The link to load the game)
    gameUrl: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    // 7. Is Active
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    // 8. Deleted At (For Soft Delete)
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    // Enable paranoid mode for automatic soft delete handling
    paranoid: true, 
    tableName: 'games'
});
