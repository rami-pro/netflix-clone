const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
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
  if (existingUser.password !== password) return;

  return existingUser;
});

mongoose.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
