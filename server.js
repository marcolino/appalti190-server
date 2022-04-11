const express = require("express");
const path = require("path");
const cors = require("cors");
//const bodyParser = require("body-parser");
//const logger = require("winston");
const db = require("./src/models");
const { assertEnvironment } = require("./src/helpers/environment");
const config = require("./src/config");

const app = express();

// enable CORS, and whitelist our domains
app.use(cors({
  origin: config.corsDomains,
}));

// parse requests of content-type - application/json
app.use(express.json({
  limit: config.api.payloadLimit, // limit payload to avoid too much data to be uploaded
}));

// add default headers
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept, x-access-token, x-user-language",
  );
  next();
});

// handle version, if needed
app.use((req, res, next) => {
  // req.version is used to determine the version
  req.version = req.headers['accept-version'];
  next();
});

// handle client preferred language (please place this middleware before declaring any routes)
app.use((req, res, next) => {
  let language;
  config.languages.every((lang, index) => { // list of backend supported languages; the last one is the fallback
    language = req.get("x-user-language");
    if (language) return false; // break
    return true;
  });
  req.language = language;
  //console.log("LANGUAGE PREFERRED BY CLIENT:", req.language);
  // TODO: implement i18n server side too
  next();
})

// use environment configuration
if (!process.env.NODE_ENV) { // load environment variables from .env file in development environments
  require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
}
if (process.env.NODE_ENV === "test") { // load environment variables from .env.test file in test environments
  require("dotenv").config({ path: path.resolve(__dirname, "./.env.test") });
}

assertEnvironment();

// set up database connection uri
const connUri = (process.env.NODE_ENV === "production") ?
  `${process.env.MONGO_SCHEME}://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}/${process.env.MONGO_DB}` :
  `${process.env.MONGO_SCHEME}://${process.env.MONGO_URL}/${process.env.MONGO_DB}`
;

// connect to database
db.mongoose
  .connect(connUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    if (process.env.NODE_ENV !== "test") {
      console.log("Successfully connected to MongoDB");
    }
    db.populate(); // populate database with initial contents if first time
  })
  .catch(err => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
  })
;

// routes
require("./src/routes/auth.routes")(app);
require("./src/routes/user.routes")(app);
require("./src/routes/job.routes")(app);
require("./src/routes/payment.routes")(app);

// serve the static files from the client - "client" is a link to the frontend site
const root = path.join(__dirname, 'client', 'build');
app.use(express.static(root));

// handles any requests that does not match the routes below (all routes handled by client)
app.get("*", (req, res) => {
  res.sendFile("index.html", { root });
});

// set port and listen for requests
if (require.main === module) { // avoid listening while testing
  const PORT = process.env.PORT || config.api.port;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} else { // export app for testing
  module.exports = app;
}
