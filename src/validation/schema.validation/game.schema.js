// schemas/game.schema.js

/**
 * Schema for updating a game
 */
export const updateGameSchema = {
  type: "object",
  required: ["data"],
  properties: {
    data: {
      type: "object",
      minProperties: 1, // At least one field must be updated
      properties: {
        name: {
          type: "string",
          minLength: 3,
          maxLength: 100,
          pattern: "^[a-zA-Z0-9\\s\\-:'.!]+$", // Allow alphanumeric, spaces, and common punctuation
          errorMessage: {
            type: "Name must be a string",
            minLength: "Name must be at least 3 characters long",
            maxLength: "Name cannot exceed 100 characters",
            pattern: "Name contains invalid characters"
          }
        },
        description: {
          type: "string",
          minLength: 10,
          maxLength: 1000,
          errorMessage: {
            type: "Description must be a string",
            minLength: "Description must be at least 10 characters long",
            maxLength: "Description cannot exceed 1000 characters"
          }
        },
        genre: {
          type: "string",
          enum: ["RPG", "Action", "Adventure", "Sports", "Strategy", "Simulation", "Puzzle", "Horror", "Racing", "Fighting"],
          errorMessage: {
            type: "Genre must be a string",
            enum: "Genre must be one of: RPG, Action, Adventure, Sports, Strategy, Simulation, Puzzle, Horror, Racing, Fighting"
          }
        },
        isActive: {
          type: "boolean",
          errorMessage: {
            type: "isActive must be a boolean (true or false)"
          }
        },
        imageUrl: {
          type: "string",
          format: "uri",
          pattern: "^https?://",
          minLength: 10,
          maxLength: 500,
          errorMessage: {
            type: "Image URL must be a string",
            format: "Image URL must be a valid URL",
            pattern: "Image URL must start with http:// or https://",
            minLength: "Image URL is too short",
            maxLength: "Image URL cannot exceed 500 characters"
          }
        },
        gameUrl: {
          type: "string",
          format: "uri",
          pattern: "^https?://",
          minLength: 10,
          maxLength: 500,
          errorMessage: {
            type: "Game URL must be a string",
            format: "Game URL must be a valid URL",
            pattern: "Game URL must start with http:// or https://",
            minLength: "Game URL is too short",
            maxLength: "Game URL cannot exceed 500 characters"
          }
        }
      },
      additionalProperties: false, // Don't allow fields not in schema
      errorMessage: {
        type: "Data must be an object",
        minProperties: "At least one field must be provided for update",
        additionalProperties: "Unknown field in data object"
      }
    }
  },
  additionalProperties: false,
  errorMessage: {
    required: "Data field is required",
    type: "Request body must be an object",
    additionalProperties: "Unknown field in request body"
  }
};

/**
 * Schema for creating a game (all fields required)
 */
export const createGameSchema = {
  type: "object",
  required: ["data"],
  properties: {
    data: {
      type: "object",
      required: ["name", "description", "genre", "imageUrl", "gameUrl"],
      properties: {
        name: {
          type: "string",
          minLength: 3,
          maxLength: 100,
          pattern: "^[a-zA-Z0-9\\s\\-:'.!]+$",
          errorMessage: {
            type: "Name must be a string",
            minLength: "Name must be at least 3 characters long",
            maxLength: "Name cannot exceed 100 characters",
            pattern: "Name contains invalid characters"
          }
        },
        description: {
          type: "string",
          minLength: 10,
          maxLength: 1000,
          errorMessage: {
            type: "Description must be a string",
            minLength: "Description must be at least 10 characters long",
            maxLength: "Description cannot exceed 1000 characters"
          }
        },
        genre: {
          type: "string",
          enum: ["RPG", "Action", "Adventure", "Sports", "Strategy", "Simulation", "Puzzle", "Horror", "Racing", "Fighting"],
          errorMessage: {
            type: "Genre must be a string",
            enum: "Genre must be one of: RPG, Action, Adventure, Sports, Strategy, Simulation, Puzzle, Horror, Racing, Fighting"
          }
        },
        isActive: {
          type: "boolean",
          default: true, // Default to active if not provided
          errorMessage: {
            type: "isActive must be a boolean (true or false)"
          }
        },
        imageUrl: {
          type: "string",
          format: "uri",
          pattern: "^https?://",
          minLength: 10,
          maxLength: 500,
          errorMessage: {
            type: "Image URL must be a string",
            format: "Image URL must be a valid URL",
            pattern: "Image URL must start with http:// or https://",
            minLength: "Image URL is too short",
            maxLength: "Image URL cannot exceed 500 characters"
          }
        },
        gameUrl: {
          type: "string",
          format: "uri",
          pattern: "^https?://",
          minLength: 10,
          maxLength: 500,
          errorMessage: {
            type: "Game URL must be a string",
            format: "Game URL must be a valid URL",
            pattern: "Game URL must start with http:// or https://",
            minLength: "Game URL is too short",
            maxLength: "Game URL cannot exceed 500 characters"
          }
        }
      },
      additionalProperties: false,
      errorMessage: {
        type: "Data must be an object",
        required: "Missing required fields in data object",
        additionalProperties: "Unknown field in data object"
      }
    }
  },
  additionalProperties: false,
  errorMessage: {
    required: "Data field is required",
    type: "Request body must be an object",
    additionalProperties: "Unknown field in request body"
  }
};

/**
 * Schema for game ID parameter (UUID format)
 */
export const gameIdParamSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "string",
      format: "uuid",
      errorMessage: {
        type: "Game ID must be a string",
        format: "Game ID must be a valid UUID",
        required: "Game ID is required"
      }
    }
  },
  additionalProperties: false
};

/**
 * Alternative: Schema for game ID parameter (numeric ID)
 */
export const gameIdParamSchemaNumeric = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "string",
      pattern: "^[0-9]+$",
      errorMessage: {
        type: "Game ID must be a string",
        pattern: "Game ID must be a valid numeric ID",
        required: "Game ID is required"
      }
    }
  },
  additionalProperties: false
};

/**
 * Schema for listing/filtering games
 */
export const listGamesQuerySchema = {
  type: "object",
  properties: {
    page: {
      type: "integer",
      minimum: 1,
      default: 1,
      errorMessage: {
        type: "Page must be a number",
        minimum: "Page must be at least 1"
      }
    },
    limit: {
      type: "integer",
      minimum: 1,
      maximum: 100,
      default: 10,
      errorMessage: {
        type: "Limit must be a number",
        minimum: "Limit must be at least 1",
        maximum: "Limit cannot exceed 100"
      }
    },
    genre: {
      type: "string",
      enum: ["RPG", "Action", "Adventure", "Sports", "Strategy", "Simulation", "Puzzle", "Horror", "Racing", "Fighting"],
      errorMessage: {
        enum: "Invalid genre filter"
      }
    },
    isActive: {
      type: "string",
      enum: ["true", "false"],
      errorMessage: {
        enum: "isActive must be 'true' or 'false'"
      }
    },
    search: {
      type: "string",
      minLength: 2,
      maxLength: 100,
      errorMessage: {
        minLength: "Search query must be at least 2 characters",
        maxLength: "Search query cannot exceed 100 characters"
      }
    },
    sortBy: {
      type: "string",
      enum: ["name", "genre", "createdAt", "updatedAt"],
      default: "createdAt",
      errorMessage: {
        enum: "sortBy must be one of: name, genre, createdAt, updatedAt"
      }
    },
    sortOrder: {
      type: "string",
      enum: ["asc", "desc"],
      default: "desc",
      errorMessage: {
        enum: "sortOrder must be 'asc' or 'desc'"
      }
    }
  },
  additionalProperties: false,
  errorMessage: {
    additionalProperties: "Unknown query parameter"
  }
};