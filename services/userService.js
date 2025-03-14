const bcrypt = require("bcryptjs");

const users = []; // Dummy in-memory user storage

const userService = {
  findUserByEmail: async (email) => {
    return users.find((user) => user.email === email);
  },

  updateUserPassword: async (email, newPassword) => {
    const user = users.find((user) => user.email === email);
    if (!user) return null;

    user.password = newPassword;
    return user;
  },
};

module.exports = userService;
