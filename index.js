const fs = require("fs");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const geocode = require("./util/location");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("tiny"));

app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
    next(new HttpError("couldn't find this route.", 404));
});

app.use((error, req, res, next) => {
    if (req.file) {
        
        
        
        
        fs.unlink(req.file.path, (er) => console.log(er));
    }if (res.headerSent) {
        return next(error);
    }

    res.status(error.code || 500).send({
        message: error.message || "Unknown error occured on the server"
    });
});

mongoose
    .connect(process.env.DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("connection establishsed");
        app.listen(process.env.PORT, (err) => {
            if (err) console.log(err);

            console.log(`app running on port ${process.env.PORT}`);
        });
    })
    .catch((e) => console.log(e.message));
