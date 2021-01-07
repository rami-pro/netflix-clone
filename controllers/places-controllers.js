const HttpError = require("../models/http-error");

const getPlaceById = (req, res, next) => {
  const place = PLACES.filter((place) => place.id === req.params.pid);
  console.log(req.query);

  if (!place.length) {
    return next(new HttpError("no place found", 404));
  }
  res.send(place);
};

const getPlacesByUserId = (req, res, next) => {
  const place = PLACES.filter((place) => place.creatorId === req.params.uid);
  console.log(req.query);

  if (!place.length) {
    throw new HttpError("no place found", 404);
  }
  res.send(place);
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
};
