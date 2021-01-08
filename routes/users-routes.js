const express = require("express");
const { check } = require("express-validator");
const {
  signupUser,
  loginUser,
  updateUser,
  deleteUser,
  findAllUsers,
} = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", findAllUsers);
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signupUser
);
router.post("/login", loginUser);
router.patch("/:uid", updateUser);
router.delete("/:uid", deleteUser);

module.exports = router;
