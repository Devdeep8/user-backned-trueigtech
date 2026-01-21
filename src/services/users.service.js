import userRepository from "../dbOperation/user.repository.js";
import AppError from "../utils/appError.js";
import bcrypt from "bcryptjs";

class UserService {
  constructor() {
    this.userRepository = userRepository;
  }

  async createUser(data) {
    const {password , ...rest} = data;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user  = await this.userRepository.createUser({...rest , password : hashedPassword});
    if (!user) {
      throw new AppError("User not created", 400);
    }
    return user;
  }
  async getAllUsers() {
    return await this.userRepository.getAllUsers();
  }
  async getUserById(id) {
    return await this.userRepository.getUserByIdentifier({ id });
  }
  async updateUser(id, data) {
    // 1️⃣ Get existing user
    const user = await this.userRepository.getUserByIdentifier({ id });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // 2️⃣ If role is being updated
    if (data.role && data.role !== user.userRole.name) {
      // 3️⃣ If new role is admin → invalidate refresh token

      data.refreshToken = null; // or undefined based on your DB
    }

    // 4️⃣ Update user
    const [affectedRows] = await this.userRepository.updateUser(id, data);

    if (affectedRows === 0) {
      throw new AppError("No changes applied", 400);
    }

    // 5️⃣ Return updated user
    return await this.userRepository.getUserByIdentifier({ id });
  }
  async deleteUser(id) {
    const deletedUser = await this.userRepository.softDeleteUser(id);
    if (!deletedUser) {
      throw new AppError("User not found", 404);
    }
    return deletedUser;
  }



  async toggleActive(id) {
    const user = await this.userRepository.getUserByIdentifier({id});
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const updatedUser = await this.userRepository.updateUser(id , {isActive : !user.isActive});
    if (!updatedUser) {
      throw new AppError("User not updated", 404);
    }
    return updatedUser;
  }
}
export default new UserService();
