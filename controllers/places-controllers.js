const { nanoid } = require("nanoid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Place = require("../models/place");
const geocode = require("../util/location");

let PLACES = [
  {
    state: "algeria",
    address: "Oran, Santa Cruze",
    monument: "fort de santa cruz",
    id: "p1",
    creatorId: "u1",
  },
];

const getPlaceById = async (req, res, next) => {
  let place;
  try {
    place = await Place.findOne({ _id: req.params.pid });
  } catch (error) {
    return next(new HttpError("query error", 500));
  }

  if (!place) {
    return next(new HttpError("no place found", 404));
  }
  res.send(place.toObject({ getters: true }));
};

const getPlacesByUserId = async (req, res, next) => {
  let place;
  try {
    place = await Place.find({ creator: req.params.uid });
  } catch (error) {
    return next(new HttpError("internal error can't find a place", 500));
  }

  if (!place) {
    return next(new HttpError("no place found", 404));
  }
  res.send(place.map((place) => place.toObject({ getters: true })));
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs data", 422));
  }

  let coordinates;
  try {
    coordinates = await geocode(req.body.address);
  } catch (error) {
    return next(error);
  }
  const createdPlace = new Place({
    ...req.body,
    image: "https://via.placeholder.com/150/771796",
    location: coordinates,
    creator: nanoid(),
  });

  try {
    await createdPlace.save();
  } catch (error) {
    return next(new HttpError("creating a place failed", 500));
  }
  res.status(201).send(createdPlace);
};

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid inputs data", 422));
  }

  let place;
  try {
    place = await Place.findOne({ _id: req.params.pid });
  } catch (error) {
    return next(new HttpError("query error", 500));
  }
  if (!place) {
    return next(new HttpError("no place found", 404));
  }
  for (key in req.body) {
    place[key] = req.body[key];
  }
  try {
    await place.save();
  } catch (error) {
    return next(new HttpError("updating a place failed", 500));
  }
  res.send(place.toObject({ getters: true }));
};

const deletePlaceById = async (req, res, next) => {
  let place;
  try {
    place = await Place.findOne({ _id: req.params.pid });
  } catch (error) {
    return next(new HttpError("query error", 500));
  }

  if (!place) {
    return next(new HttpError("no place found", 404));
  }
  try {
    await place.remove();
  } catch (error) {
    console.log(error);
    return next(new HttpError("deleting a place failed", 500));
  }
  res.send();
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlaceById,
  deletePlaceById,
};
