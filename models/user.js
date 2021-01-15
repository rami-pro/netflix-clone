const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uniqueValidator = require("mongoose-unique-validator");
const HttpError = require("../models/http-error");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
});

userSchema.static("findByEmailAndPassword", async function (email, password) {
  let existingUser;
  try {
    existingUser = await this.findOne({ email });
  } catch (error) {
    throw new Error(error);
  }
  if (!existingUser) return;

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    throw new Error("invalid credentials, please try again.");
  }
  if (!isValidPassword) return;

  return existingUser;
});

userSchema.methods.generateAuthToken = function () {
  let token;
  try {
    token = jwt.sign(
      { id: this._id, email: this.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
  } catch (error) {
    throw new HttpError("pan error occured try again", 500);
  }

  return token;
};

mongoose.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
