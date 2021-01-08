const axios = require("axios");
const HttpError = require("../models/http-error");
const API_KEY =
  "pk.eyJ1IjoicmFtaWdiMDEiLCJhIjoiY2tqbmtzYW9pMTh1bDJ6czJhOHN4Zmt5aCJ9.HffnPY_281p-lRDN0IF5vQ";

const geocode = async (address) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=${API_KEY}&limit=1`;
  const { data } = await axios.get(url);

  if (!data || data.features.length < 1) {
    throw new HttpError("no places found with the given address", 404);
  }
  const [lat, lng] = data.features[0].center;

  return {
    lat,
    lng,
  };
};

module.exports = geocode;
