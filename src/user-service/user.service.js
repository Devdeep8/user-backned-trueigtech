// src/services/userService.js
import EventEmitter from "events";
import messageQueueClient from "./messageQueueClient.js";
import { User } from "../model/user.model.js";

class UserService extends EventEmitter {
  constructor() {
    super();
    // Internal Listener (Example: Log every user created internally)
    this.on("userCreatedInternal", (user) => {
      (
        `🔕 [Service Internal Log]: User ${user.name} validated locally.`
      );
    });
    this.on("userDeletion", (deletedUser) => {
      (
        `🔕 [Service Internal Log]: User ${deletedUser.id} validated locally.`
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

    const user = {
      createdAt: new Date(),
      ...userData,
    };

    (`🏭 [Service] Processing User: ${user.name}`);

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

    this.emit("userUpdatedInternal", updatedUser);
    try {
      await messageQueueClient.publish("user_operations", {
        type: "UserUpdated",
        payload: updatedUser,
      });
      this.emit("userPublished", updatedUser);
    } catch (error) {
      this.emit("errorPublishing", error);
      throw error;
    }

    return updatedUser;
  }

  async deleteUser(userId) {
    const deletedUser = { id: userId };
    // this.emit("userDeletion", deletedUser);

    try {
      await messageQueueClient.publish("user_operations", {
        type: "UserDelete",
        payload: deletedUser,
      });
      this.emit("userDeletion", deletedUser);
    } catch (error) {
      this.emit("errorPublishing", error);
      throw error;
    }
  }

  async getUser() {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }, // Don't send passwords back
    });
    return users;
  }
   async getUserById(id) {
  return await User.findOne({
    where: {
      id,
      deletedAt: null,
    },
  });
};
}



export default new UserService();
