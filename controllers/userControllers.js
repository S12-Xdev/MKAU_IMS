const userUtils = require("../utils/authUtils");
const bcrypt = require("bcryptjs");
const userService = require("../services/userService");
const { string } = require("joi");

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
        message: `Welcome Mr. ${user.first_name} ${user.last_name} to Your Profile as ${user.role.role_name}`,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  userRegister: async (req, res) => {
    try {
      console.log("File Object:", req.file); // Log the file object

      const { first_name, last_name, email, password, role } = req.body;
      const photo = req.file ? req.file.path : null;

      if (!photo) {
        return res.status(400).json({ error: "Profile picture is required" });
      }

      const userExist = await userService.findUserByEmail(email);
      if (userExist) {
        return res
          .status(400)
          .json({ error: "This user is already registered!" });
      }
      console.log("pass=", password);
      const pass1 = String(password);
      const hashedPassword = await userUtils.hashPassword(pass1);
      const newUser = {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        role,
        photo, // Check if this is being properly passed to the service
      };

      const userCreated = await userService.createUser(newUser);
      if (userCreated) {
        return res
          .status(201)
          .json({ message: "You have successfully signed up!" });
      } else {
        return res.status(500).json({ error: "User registration failed" });
      }
    } catch (error) {
      console.error("Error during registration:", error); // Log the full error stack
      res.status(500).json({ error: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const Data = req.body;
      const userEmail = req.userEmail;

      const userUpdated = await userService.updateUserProfile(userEmail, Data);
      if (!userUpdated) {
        return res.status(500).json({ error: "Profile update failed" });
      }

      res.json({ message: "Your profile has been updated successfully" });
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
