const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  registerUser,
  loginUser,
  deleteUser,
  updateUser,
  getSingleUser,
} = require("../controllers/userController");

// Update user validation middleware
const { updateUserValidation } = require("../middlewares/updateUserValidation");
// Verify token middleware
const verifyToken = require("../middlewares/verifyToken");
const allowTo = require("../middlewares/allowTo");
const userRoles = require("../utils/userRoles");

router.route("/").get(verifyToken, allowTo(userRoles.ADMIN), getAllUsers);

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router
  .route("/:id")
  .get(verifyToken, getSingleUser)
  .patch(
    verifyToken,
    allowTo(userRoles.ADMIN),
    updateUserValidation,
    updateUser
  )
  .delete(verifyToken, allowTo(userRoles.ADMIN), deleteUser);

module.exports = router;
