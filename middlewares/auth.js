const jwt = require("jsonwebtoken");
const User = require("../models/user");
const HttpError = require("../models/http-error");

const auth = async (req, res, next) => {
  if (req.method === "OPTIONS") return next();

  try {
    const token = req.header("Authorization").replace("Bearer", "").trim();
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) throw new HttpError("please athenticate", 401);

    const user = await User.findOne({ _id: decode.id }, "-password");
    if (!user) throw new HttpError("please athenticate", 401);

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
