const authUtils = require("../utils/authUtils");
const userService = require("../services/userService");

const userControllers = {
  welcomePage: (req, res) => {
    res.json({ message: "Welcome to MKAU-IMS System" });
  },

  userProfile: async (req, res) => {
    try {
      const userEmail = req.user.email;
      const user = await userService.findUserByEmail(userEmail);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        message: `Welcome Mr. ${user.first_name} ${
          user.last_name
        } to Your Profile as ${user.role?.role_name ?? "User"}`,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  userRegister: async (req, res) => {
    try {
      const { first_name, last_name, email, password, roleName } = req.body;
      const photo = req.file ? req.file.path : null;

      if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (!photo) {
        return res.status(400).json({ error: "Profile picture is required" });
      }

      if (!roleName) {
        return res.status(400).json({ error: "Role name is required" });
      }

      const userExist = await userService.findUserByEmail(email);
      if (userExist) {
        return res
          .status(400)
          .json({ error: "This user is already registered!" });
      }
      const hashedPassword = await authUtils.hashPassword(String(password));
      const newUser = {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        roleName,
        photo,
      };

      const userCreated = await userService.createUser(newUser);
      if (!userCreated) {
        return res.status(500).json({ error: "User registration failed" });
      }

      const { password: _password, ...safeUser } = userCreated.get({
        plain: true,
      });
      return res.status(201).json({
        message: "You have successfully signed up!",
        user: safeUser,
      });
    } catch (error) {
      console.error("Error during registration:", error); // Log the full error stack
      res.status(500).json({ error: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const Data = { ...req.body };
      const userEmail = req.user.email;

      if (Data.password) {
        Data.password = await authUtils.hashPassword(String(Data.password));
      }

      const userUpdated = await userService.updateUserProfile(userEmail, Data);
      if (!userUpdated) {
        return res.status(500).json({ error: "Profile update failed" });
      }

      const { password: _password, ...safeUser } = userUpdated.get({
        plain: true,
      });
      res.json({
        message: "Your profile has been updated successfully",
        user: safeUser,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteProfile: async (req, res) => {
    try {
      const userEmail = req.user.email;

      const profileDeleted = await userService.deleteUserProfile(userEmail);
      if (!profileDeleted) {
        return res.status(500).json({ error: "Profile deletion failed" });
      }

      res.json({ message: "Your profile has been deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = userControllers;
