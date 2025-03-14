const userControllers = {
  welcomePage: (req, res) => {
    res.json({ message: "Welcome to MKAU-IMS System" });
  },

  userLogin: (req, res) => {
    const { email, password } = req.body;
    res.json({ message: "Please Login Here" });
  },

  userProfile: (req, res) => {
    // Example: Dummy user profile data
    res.json({ message: "Welcome to Your Profile" });
  },

  updateProfile: (req, res) => {
    const updatedData = req.body;

    // Example: Simulating an update operation
    res.json({ message: "Profile deleted successfully" });
  },

  deleteProfile: (req, res) => {
    // Example: Simulating a delete operation
    res.json({ message: "Profile deleted successfully" });
  },
};

module.exports = userControllers;
