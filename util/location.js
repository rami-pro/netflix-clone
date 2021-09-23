const axios = require("axios");
const HttpError = require("../models/http-error");

const mapboxApi = (address) =>
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
    )}.json?access_token=${process.env.MAPBOX_KEY}&&limit=1`;

const geocode = async (address) => {
    const url = mapboxApi(address);

    try {
        const { data } = await axios.get(url);

        if (!data || data.features.length < 1) {
            throw new HttpError("no places found with the given address", 404);
        }

        const [lat, lng] = data.features[0].center;
        return {
            lat,
            lng
        };
    } catch (error) {
        throw new HttpError(error.message, 400);
    }
};

module.exports = geocode;
