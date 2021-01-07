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

app.use(placesRoutes);

app.listen(8080, (err) => {
  if (err) console.log(err);

  console.log("app listening on port 80");
  console.log("heeelo world");
});
