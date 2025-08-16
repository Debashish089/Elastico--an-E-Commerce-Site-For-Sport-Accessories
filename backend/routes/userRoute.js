const express = require("express");
const {registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, DeleteUser} = require("../controllers/userController");

const {isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);   // registerUser func banano ache userController e. jkhn e "/register" api te jabe user, tkhn ei func call hbe and eta ekta post req, means create req.

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser , getUserDetails);

router.route("/password/update").put(isAuthenticatedUser , updatePassword);

router.route("/me/update").put(isAuthenticatedUser , updateProfile);

router.route("/admin/users").get(isAuthenticatedUser , authorizeRoles("admin"), getAllUser);   // authorize role admin, only admin er access

router
.route("/admin/user/:id")
.get(isAuthenticatedUser , authorizeRoles("admin"), getSingleUser)
.put(isAuthenticatedUser , authorizeRoles("admin"), updateUserRole)
.delete(isAuthenticatedUser , authorizeRoles("admin"), DeleteUser);



module.exports = router;
