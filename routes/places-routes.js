const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("hello from places");

  res.send({ msg: "bonjour pnipen" });
});

module.exports = router;
