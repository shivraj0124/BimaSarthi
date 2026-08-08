const express = require("express");
const router = express.Router();
const { signup, login,getSingleUser,verifyWidgetToken,resetPassword,checkMobileExists } = require("../controllers/AuthController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/getSingleUser", getSingleUser);
router.post("/verify-widget-token", verifyWidgetToken);
router.post("/check-mobile", checkMobileExists);
router.post("/reset-password", resetPassword);

module.exports = router;
