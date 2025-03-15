const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/userControllers");

router.get("/", userControllers.welcomePage);
router.post("/userRegister", userControllers.userRegister);
router.get("/profile", userControllers.userProfile);
router.put("/updateProfile", userControllers.updateProfile);
router.delete("/deleteProfile", userControllers.deleteProfile);

module.exports = router;
