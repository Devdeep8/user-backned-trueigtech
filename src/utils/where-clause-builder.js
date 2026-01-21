// utils/queryFilters.js

/**
 * Build WHERE conditions based on user permissions
 * @param {Object} user - User object with permissions
 * @param {String} resource - Resource name (e.g., 'game', 'user')
 * @returns {Object} - Sequelize WHERE conditions
 */
export const buildResourceFilter = (user, resource) => {
  const whereCondition = { deletedAt: null };
//   console.log(user);
  if (!user || !user.permissions) {
    // No user or no permissions → show only active, non-deleted items
    whereCondition.isActive = true;
    return whereCondition;
  }

  // Check for specific permissions
  const hasRead = user.permissions.includes(`${resource}.read`);
  const hasUpdate = user.permissions.includes(`${resource}.update`);

  // Logic:
  // 1. If user has BOTH game:read AND game:update → show ALL games (active + inactive)
  // 2. If user has ONLY game:read → show only ACTIVE games
  // 3. If user has no permissions → show only ACTIVE games

  if (hasRead && hasUpdate) {
    // Has both read and update → show all games (active + inactive)
    // Only filter: deletedAt is null
    return whereCondition;
  }

  if (hasRead) {
    // Has only read → show only active games
    whereCondition.isActive = true;
    return whereCondition;
  }

  // Default: no permissions → show only active games
  whereCondition.isActive = true;
  console.log(whereCondition);
  return whereCondition;
};