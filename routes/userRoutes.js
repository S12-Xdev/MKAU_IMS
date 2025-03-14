const express = require("express");
const router = express.Router();

const userControllers = require('../controllers')

router.get('/user', userControllers.welcomePage);
router.post('/user/login', userControllers.userLogin);
router.get('/user/profile', userControllers.userProfile);
router.put('/user/profileUpdate', userControllers.updateUpdate);
router.delete('/user/profileDelete', userControllers.updateDelete);

module.exports = router;