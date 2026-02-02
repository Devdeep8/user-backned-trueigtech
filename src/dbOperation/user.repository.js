import { db,  } from "../model/index.js";
const {user , permission , role } = db
class UserRepository {
  constructor() {
    this.user = user;
  }

  async getUserById(id) {
    return await this.user.findByPk(id, {
      include: [
        {
          model: role,
          include: [
            {
              model: permission,
              through: { attributes: [] },
            },
          ],
        },
      ],
    });
  }

  async getUserByIdentifier(where) {
    return await this.user.findOne({
      where,
      attributes: ["id", "name", "email", "isActive" , "refreshToken"], // only needed user fields
      include: [
        {
          model: role,
          attributes: ["name"], // only role name
          include: [
            {
              model: permission,
              attributes: ["key"], // only permission key
              through: { attributes: [] }, // remove join table attributes
            },
          ],
        },
      ],
    });
  }

  async createUser(data) {
    const user = await this.user.create(data);

    // Fetch the created user with Role included (same format as other methods)
    return await this.getUserByIdentifier({ id: user.id });
  }

  async getAllUsers() {
    return await this.user.findAll({
      include: [
        {
          model: role,
          include: [
            {
              model: permission,
              through: { attributes: [] },
            },
          ],
        },
      ],
      attributes: { exclude: ["password"] },
    });
  }

  async updateUser(id, data) {
    const user = await this.user.update(data, { where: { id } });
    return user;
  }

  async softDeleteUser(id) {
    return await this.user.update({ deletedAt: new Date() }, { where: { id } });
  }
}
export default new UserRepository();
