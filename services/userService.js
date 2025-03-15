const { Users, Roles } = require("../models");

const userService = {
  findUserByEmail: async (email) => {
    const userFounded = await Users.findOne({
      where: { email },
      include: { model: Roles, as: "role" }, // Fetch role info
    });
    if (!userFounded) {
      return null;
    }
    return userFounded;
  },

  createUser: async (userData) => {
    const role = await Roles.findOne({ where: { role_name: userData.role } });
    if (!role) throw new Error("Role not found");

    const createUser = await Users.create({ ...userData, role_id: role.id });

    if (!createUser) {
      return null;
    }
    return true;
  },

  deleteUserProfile: async (email) => {
    const deleted = await Users.destroy({ where: { email } });
    if (!deleted) {
      return null;
    }
    return true;
  },

  updateUserProfile: async (email, Data) => {
    const [updated] = await Users.update(Data, { where: { email } });
    if (!updated) {
      return null;
    }
    return true;
  },

  updateUserPassword: async (email, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [updated] = await Users.update(
      { password: hashedPassword },
      { where: { email } }
    );
    if (!updated) {
      return null;
    }
    return true;
  },
};

module.exports = userService;
