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
    const { roleName, ...rest } = userData;
    const role = await Roles.findOne({ where: { role_name: roleName } });
    if (!role) throw new Error("Role not found");

    const createUser = await Users.create({ ...rest, role_id: role.id });

    if (!createUser) {
      return null;
    }

    return Users.findOne({
      where: { id: createUser.id },
      attributes: { exclude: ["password"] },
      include: { model: Roles, as: "role" },
    });
  },

  deleteUserProfile: async (email) => {
    const deleted = await Users.destroy({ where: { email } });
    if (!deleted) {
      return null;
    }
    return true;
  },

  updateUserProfile: async (email, Data) => {
    const updatePayload = { ...Data };

    if (Data.roleName) {
      const role = await Roles.findOne({ where: { role_name: Data.roleName } });
      if (!role) {
        throw new Error("Role not found");
      }
      updatePayload.role_id = role.id;
      delete updatePayload.roleName;
    }

    const [updatedCount, updatedRows] = await Users.update(updatePayload, {
      where: { email },
      returning: true,
    });
    if (!updatedCount) {
      return null;
    }
    const updatedUser = updatedRows[0];
    return Users.findOne({
      where: { id: updatedUser.id },
      attributes: { exclude: ["password"] },
      include: { model: Roles, as: "role" },
    });
  },

  updateUserPassword: async (email, newPassword) => {
    const [updatedCount] = await Users.update(
      { password: newPassword },
      { where: { email } }
    );
    if (!updatedCount) {
      return null;
    }
    return true;
  },
};

module.exports = userService;
