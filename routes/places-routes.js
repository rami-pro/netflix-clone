const express = require("express");
const router = express.Router();

const {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlaceById,
  deletePlaceById,
} = require("../controllers/places-controllers");

router.get("/:pid", getPlaceById);
router.get("/user/:uid", getPlacesByUserId);
router.post("/", createPlace);
router.patch("/:pid", updatePlaceById);
router.delete("/:pid", deletePlaceById);

module.exports = router;
