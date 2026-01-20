import userService from "../services/users.service.js";
import authService from "../services/auth.service.js";
import AppError from "../utils/appError.js";

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();

      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: { users },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError("User ID is required", 400);
      }

      const user = await userService.getUserById(id);

      res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;

      if (!id) {
        throw new AppError("User ID is required", 400);
      }

      if (!data || Object.keys(data).length === 0) {
        throw new AppError("Update data is required", 400);
      }

      const user = await userService.updateUser(id, data);

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError("User ID is required", 400);
      }

      await userService.deleteUser(id);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleActive(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError("User ID is required", 400);
      }

      const user = await userService.toggleActive(id);

      res.status(200).json({
        success: true,
        message: "User status toggled successfully",
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async forceLogout(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) throw new AppError("User ID is required", 400);

      await authService.logout(id);

      res.status(200).json({
        success: true,
        message: "User force logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async userSoftDelete(req , res , next){
    try{
    const {id} = req.params;

    const user = await userService.deleteUser(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
    }
    catch(error){
      next(error);
    }
  }
}

export default new UserController();
