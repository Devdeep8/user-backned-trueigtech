# Service-Level Logging Strategy

## Objective

To implement a structured logging system that identifies which service is generating logs or errors. This will help in debugging issues by clearly isolating them to specific services (e.g., `GetAllGamesService`, `AuthService`).

## 1. Create a Logger Utility (`src/utils/logger.js`)

We need a standardized logger that can format messages with metadata (like Service Name, Timestamp, etc.).

```javascript
// src/utils/logger.js
export class ServiceLogger {
  constructor(serviceName, requestId = "N/A") {
    this.serviceName = serviceName;
    this.requestId = requestId;
  }

  formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    const dataStr = data ? JSON.stringify(data, null, 2) : "";
    return `[${timestamp}] [${level}] [${this.serviceName}] [${this.requestId}]: ${message} ${dataStr}`;
  }

  info(message, data) {
    console.log(this.formatMessage("INFO", message, data));
  }

  error(message, error) {
    console.error(this.formatMessage("ERROR", message), error);
  }

  warn(message, data) {
    console.warn(this.formatMessage("WARN", message, data));
  }

  debug(message, data) {
    console.debug(this.formatMessage("DEBUG", message, data));
  }
}
```

## 2. Integrate Logger into BaseService (`src/services/base.service.js`)

Modify the `BaseService` to automatically instantiate a logger for every service. We use `this.constructor.name` to dynamically get the class name (e.g., "GetAllGamesService").

```javascript
// src/services/base.service.js
import { ServiceLogger } from "../utils/logger.js";

export class BaseService {
  constructor(error, args, context, db) {
    this.error = error;
    this.args = args;
    this.context = context;
    this.db = db;

    // Ensure context is not null to avoid errors
    const safeContext = context || {};

    // Create a logger instance for this specific service class
    // 'this.constructor.name' will be 'GetAllGamesService', 'AuthService', etc.
    this.logger = new ServiceLogger(
      this.constructor.name,
      safeContext.requestId, // Assuming you pass requestId in context
    );
  }

  async run() {
    throw new Error("Method not implemented");
  }
}
```

## 3. Usage in Services (e.g., `GetAllGamesService`)

Now, inside any service, you can use `this.logger` instead of `console.log`.

```javascript
// src/services/game.services/get.game.service.js
import { GenericGetService } from "../../RESTapi/genericGetAPi.js";
import { QueryTypes } from "sequelize";

class GetAllGamesService extends GenericGetService {
  async run() {
    this.logger.info("Starting GetAllGamesService execution");
    this.logger.debug("Received arguments", this.args);

    try {
      const backendFilters = {};
      const { where, limit, offset, page } =
        await this.buildQuery(backendFilters);

      // Use structured logging instead of console.log
      this.logger.info("Built Query Params", { where, limit, offset, page });

      // ... (rest of the logic) ...

      this.logger.info("Successfully fetched games");
      return {
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        games,
      };
    } catch (error) {
      // Log the error with service context before re-throwing
      this.logger.error("Error in GetAllGamesService", error);
      throw error;
    }
  }
}
```

## 4. Enhanced Error Traceability

By implementing this, your logs will transform from:

```
WHERE (filters): { deletedAt: null }
LIMIT (per page): 10
SQL Query Error: [Error: ...]
```

To:

```
[2024-05-20T10:00:00.000Z] [INFO] [GetAllGamesService] [req-12345]: Built Query Params { where: { deletedAt: null }, limit: 10 ... }
[2024-05-20T10:00:00.123Z] [ERROR] [GetAllGamesService] [req-12345]: Error in GetAllGamesService [Error: ...]
```

## Implementation Steps

1.  **Create** `src/utils/logger.js` with the `ServiceLogger` class.
2.  **Update** `src/services/base.service.js` to import and instantiate `ServiceLogger` in the constructor.
3.  **Refactor** existing services (like `get.game.service.js`) to replace `console.log` with `this.logger.info`, `this.logger.error`, etc.
