const express = require("express");
const { check } = require("express-validator");
const {
  signupUser,
  loginUser,
  updateUser,
  deleteUser,
  findAllUsers,
  getAvatar,
} = require("../controllers/users-controllers");
const fileUpload = require("../middlewares/image-upload");

const router = express.Router();

router.get("/", findAllUsers);
router.get("/:id/avatar", getAvatar);

router.post(
  "/signup",
  fileUpload.single("image"),
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
