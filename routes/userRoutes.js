const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/userControllers");

router.get("/user", userControllers.welcomePage);
router.get("/user/profile", userControllers.userProfile);
router.put("/user/updateProfile", userControllers.updateProfile);
router.delete("/user/deleteProfile", userControllers.deleteProfile);

module.exports = router;
