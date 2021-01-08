const express = require("express");
const {
  signupUser,
  loginUser,
  updateUser,
  deleteUser,
  findAllUsers,
} = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", findAllUsers);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.patch("/:uid", updateUser);
router.delete("/:uid", deleteUser);

module.exports = router;
