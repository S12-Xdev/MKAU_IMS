const userUtils = require("../utils/authUtils");
const userService = require("../services/userService");

const userControllers = {
  welcomePage: (req, res) => {
    res.json({ message: "Welcome to MKAU-IMS System" });
  },

  userRegister: async (req, res) => {
    try {
      const { fname, lname, email, password, role } = req.body;

      const userExist = await userService.findUserByEmail(email);
      if (userExist) {
        return res
          .status(400)
          .json({ error: "This user is already registered!" });
      }

      const hashedPassword = await userUtils.hashPassword(password);
      const newUser = { fname, lname, email, password: hashedPassword, role };

      const userCreated = await userService.createUser(newUser);
      if (userCreated) {
        return res
          .status(201)
          .json({ message: "You have successfully signed up!" });
      } else {
        return res.status(500).json({ error: "User registration failed" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  userProfile: async (req, res) => {
    try {
      const userEmail = req.userEmail;
      const user = await userService.findUserByEmail(userEmail);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        message: `Welcome Mr. ${user.fname} ${user.lname} to Your Profile`,
        role: user.role.name, // Include role in response
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const Data = req.body;
      const userEmail = req.userEmail;

      const userUpdated = await userService.updateUserProfile(
        userEmail,
        Data
      );
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
      const userEmail = req.userEmail;

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
