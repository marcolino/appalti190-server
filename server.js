const express = require("express");
const path = require("path");
const cors = require("cors");
const { logger, colors } = require("./src/controllers/logger.controller");
const db = require("./src/models");
const { assertEnvironment, startupNotification } = require("./src/helpers/environment");
//const { sendemail } = require("./src/helpers/notification");
const config = require("./src/config");

const production = (process.env.NODE_ENV === "production");

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

if (production) {
  app.use(req => {
    startupNotification(req);
  });
}

// environment configuration
if (production) { // load environment variables from .env file
  logger.info(`Activating ${colors.BgGreen} production ${colors.Reset} environment`);
  require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
} else { // load environment variables from .env.test file
  logger.info(`Activating ${colors.BgYellow} test ${colors.Reset} environment`);
  require("dotenv").config({ path: path.resolve(__dirname, "./.env.test") });
}

// assert environment to be fully compliant with expectations
assertEnvironment();

// set up database connection uri
const connUri = (production) ?
  `${process.env.MONGO_SCHEME}://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}/${process.env.MONGO_DB}` :
  `${process.env.MONGO_SCHEME}://${process.env.MONGO_URL}/${process.env.MONGO_DB}`
;

// connect to database
db.mongoose
  .connect(connUri, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info("Successfully connected to MongoDB");
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

/*
// handles any requests that does not match the routes below (all routes handled by client)
app.get("*", (req, res) => {
  if (production) { 
    // TODO: someway send email to notify accesses, if no better option (see papertrail.com ...)
    logger.info(`Access to ${config.api.name} index on ${new Date().toISOString()}`);
    sendemail({subject: `Access to ${config.api.name} index on ${new Date().toISOString()}`, html: `Remote address: ${req.socket.remoteAddress}`});
  }
  res.sendFile("index.html", { root });
});
*/

// set port and listen for requests
if (require.main === module) { // avoid listening while testing
  const PORT = process.env.PORT || config.api.port;
  app.listen(PORT, () => {
    //console.log(`Server is running on port ${PORT}`);
    logger.info(`Server is running on port ${PORT}`);
  });
} else { // export app for testing
  module.exports = app;
}

// // change console.log, to truncate BIG fields
// (() => {
//   const consoleOriginal = console.log;
//   const big = 256;
//   console.log = function() {
//     const argumentsCloned = JSON.parse(JSON.stringify(arguments));
//     const argumentsTruncated = objectTruncateBigValues(argumentsCloned, big);
//     consoleOriginal.apply(this, argumentsTruncated);
//   }
//   function objectTruncateBigValues(obj, big) {
//     if (typeof obj === "object") {
//       for (const key in obj) {
//         if (typeof obj[key] === "object") {
//           objectTruncateBigValues(obj[key], big)
//         } else {
//           //if (typeof obj[key] === "string") { // truncate all string properties
//           if (key === "xml") { // truncate only "xml" properties
//             const val = obj[key].substring(0, big);
//             obj[key] = val;
//           }
//         }
//       }
//     }
//     return obj;
//   }
// })();
