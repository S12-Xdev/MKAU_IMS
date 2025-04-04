const express = require("express");
const router = express.Router();

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware"); // Destructure to import both middlewares
const upload = require('../config/fileUpload')

const userControllers = require("../controllers/userControllers");

router.get("/", userControllers.welcomePage);
router.post(
  "/userRegister",
  upload.single("profilePic"),
  userControllers.userRegister
);
router.get("/profile", authMiddleware, userControllers.userProfile); // Apply authMiddleware here
router.put("/updateProfile", authMiddleware, userControllers.updateProfile); // Apply authMiddleware here
router.delete(
  "/deleteProfile",
  authMiddleware,
  isAdmin,
  userControllers.deleteProfile
); // Apply both middlewares

module.exports = router;
