const fs = require("fs");
const { nanoid } = require("nanoid");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const sharp = require("sharp");

const HttpError = require("../models/http-error");
const Place = require("../models/place");
const User = require("../models/user");
const geocode = require("../util/location");

const getPlaceById = async (req, res, next) => {
  let place;
  try {
    place = await Place.findOne({ _id: req.params.pid });
    if (!place) {
      return next(new HttpError("no place found", 404));
    }
  } catch (error) {
    return next(new HttpError("query error", 500));
  }

  res.send(place.toObject({ getters: true }));
};

const getPlacesByUserId = async (req, res, next) => {
  //let place;
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(req.params.uid).populate("places");
    if (!userWithPlaces) return next(new HttpError("no place found", 404));
  } catch (error) {
    return next(new HttpError("internal error can't find a place", 500));
  }

  if (!userWithPlaces.places.length) {
    return next(new HttpError("no place found", 404));
  }
  res.send(
    userWithPlaces.places.map((place) => place.toObject({ getters: true }))
  );
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
    image: `${req.file.path.replace("\\", "/")}`,
    location: coordinates,
    creator: req.user._id,
  });

  try {
    createdPlace.pic = user.avatar = await sharp(req.file.buffer)
      .jpeg()
      .toBuffer();
    createdPlace.image = `/${createdPlace._id}/image`;
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    req.user.places.push(createdPlace);
    await req.user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(new HttpError("creating a place failed", 500));
  }
  res.status(201).send(createdPlace);
};

const getPlaceImage = async (req, res) => {
  try {
    const { pic } = await Place.findOne(
      { _id: req.params.id },
      { pic: 1, _id: 0 }
    );

    res.set("Content-Type", "image/jpeg");
    if (!pic) throw Error({ error: "not found" });

    res.send(pic);
  } catch (error) {
    res.status(400).send();
  }
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

  if (place.creator.toString() !== req.user._id.toString()) {
    return next(new HttpError("Unauthorized action, please authenticate", 401));
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
    place = await Place.findOne({ _id: req.params.pid }).populate("creator");
  } catch (error) {
    console.log(error);
    return next(new HttpError("query error", 500));
  }

  if (!place) {
    return next(new HttpError("no place found", 404));
  }
  console.log(place.creator._id.toString() !== req.user._id.toString());
  console.log(place.creator.toString());
  console.log(req.user._id.toString());
  if (place.creator._id.toString() !== req.user._id.toString()) {
    return next(new HttpError("Unauthorized action, please authenticate", 401));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);

    await place.creator.save({ session: sess });
    await sess.commitTransaction();
    fs.unlink(place.image, (er) => console.log(er));
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
  getPlaceImage,
};
