import userRepository from "../dbOperation/user.repository.js";
import { User } from "../model/user.model.js";
import AppError from "../utils/appError.js";
class UserService {
  async getAllUsers() {
    return await userRepository.getAllUsers();
  }
  async getUserById(id) {
    return await User.findByPk(id);
  }
  async updateUser(id, data) {
    // 1️⃣ Get existing user
    const user = await userRepository.getUserByIdentifier({ id });

    if (!user) {
      throw new AppError("User not found", 404 );
    }

    // 2️⃣ If role is being updated
    if (data.role && data.role !== user.userRole.name) {
      // 3️⃣ If new role is admin → invalidate refresh token
     
        data.refreshToken = null; // or undefined based on your DB
      
    }

    // 4️⃣ Update user
    const [affectedRows] = await userRepository.updateUser(id,data);

    if (affectedRows === 0) {
      throw new AppError("No changes applied", 400);
    }

    // 5️⃣ Return updated user
    return await userRepository.getUserByIdentifier({ id });
  }
  async deleteUser(id) {
    return await User.update({ deletedAt: new Date() }, { where: { id } });
  }
  async toggleActive(id) {
    const user = await User.findByPk(id);
    user.isActive = !user.isActive;
    await user.save();
    return user;
  }
}
export default new UserService();
