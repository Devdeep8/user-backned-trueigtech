import { User, Role } from "../model/index.js";
class UserRepository {
  constructor() {
    this.User = User;
  }

  async getUserById(id) {
    return await this.User.findByPk(id, {
      include: [
        {
          model: Role,
          as: "userRole",
        },
      ],
    });
  }

  async getUserByIdentifier(where) {
    return await this.User.findOne({
      where,
      include: [{ model: Role, as: "userRole" }],
    });
  }

  async createUser(data) {
    const user = await this.User.create(data);

    // Fetch the created user with Role included (same format as other methods)
    return await this.getUserByIdentifier({ id: user.id });
  }

  async getAllUsers() {
    return await this.User.findAll({
      include: [{ model: Role, as: "userRole" }],
      attributes: { exclude: ["password"] },
    });
  }

  async updateUser(id,data){
    return await this.User.update(data,{where:{id}})
}
}
export default new UserRepository();
