const express = require("express");
const router = express.Router();
const { signup, login,getSingleUser } = require("../controllers/AuthController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/getSingleUser", getSingleUser);

module.exports = router;
