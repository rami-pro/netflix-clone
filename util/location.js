const axios = require("axios");
const HttpError = require("../models/http-error");

const mapboxApi = (key, address) =>
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=${key}&&limit=1`;
const API_KEY =
  "pk.eyJ1IjoicmFtaWdiMDEiLCJhIjoiY2tqbmtzYW9pMTh1bDJ6czJhOHN4Zmt5aCJ9.HffnPY_281p-lRDN0IF5vQ";
const KEY =
  "pk.eyJ1IjoicmFtaWdiMDEiLCJhIjoiY2s0dHk2MzEzMDF3MzNtbnR6d2NoOGhmMCJ9._eDEHUqeGaulfOBOT70Lrg";

const geocode = async (address) => {
  const url = mapboxApi(API_KEY, address);

  try {
    const { data } = await axios.get(url);

    if (!data || data.features.length < 1) {
      throw new HttpError("no places found with the given address", 404);
    }

    const [lat, lng] = data.features[0].center;
    return {
      lat,
      lng,
    };
  } catch (error) {
    throw new HttpError(error.message, 400);
  }
};

module.exports = geocode;
