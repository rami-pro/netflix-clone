const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const placesRoutes = require("./routes/places-routes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("tiny"));

app.use("/api/places", placesRoutes);
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res
    .status(error.code || 500)
    .send({ message: error.message || "Unknown error occured on the server" });
});

app.listen(8080, (err) => {
  if (err) console.log(err);

  console.log("app listening on port 80");
  console.log("heeelo world");
});
