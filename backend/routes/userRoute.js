const express = require("express");
const {registerUser, loginUser, logout, forgotPassword, resetPassword} = require("../controllers/userController");
const router = express.Router();

router.route("/register").post(registerUser);   // registerUser func banano ache userController e. jkhn e "/register" api te jabe user, tkhn ei func call hbe and eta ekta post req, means create req.

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout);





module.exports = router;
