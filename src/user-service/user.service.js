// src/services/userService.js
import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import messageQueueClient from "./messageQueueClient.js";
import { User } from "../model/user.model.js";

class UserService extends EventEmitter {
  constructor() {
    super();
    // Internal Listener (Example: Log every user created internally)
    this.on("userCreatedInternal", (user) => {
      console.log(
        `🔕 [Service Internal Log]: User ${user.name} validated locally.`
      );
    });
  }

  /**
   * Main Method to Create User
   * 1. Generate ID
   * 2. Emit Internal Event
   * 3. Publish to RabbitMQ
   */

  async createUser(userData) {
    // 1. Generate Mock ID
    const userId = uuidv4();

    const user = {
      id: userId,
      createdAt: new Date(),
      ...userData,
    };

    console.log(`🏭 [Service] Processing User: ${user.name}`);

    // 2. Emit Internal Event (Internal State Change)
    this.emit("userCreatedInternal", user);

    // 3. Publish External Event (Message Queue)
    try {
      await messageQueueClient.publish("user_operations", {
        type: "UserCreated",
        payload: user,
      });

      // 4. Emit Success Event
      this.emit("userPublished", user);
    } catch (error) {
      this.emit("errorPublishing", error);
      throw error;
    }

    return user;
  }

  // Example: How to add another method later (e.g., Update)
  async updateUser(userId, updates) {
    const updatedUser = { id: userId, ...updates, updatedAt: new Date() };

    await messageQueueClient.publish("user_operations", {
      type: "UserUpdated",
      payload: updatedUser,
    });

    return updatedUser;
  }

  async getUser() {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }, // Don't send passwords back
    });
    return users;
  }
}

export default new UserService();
