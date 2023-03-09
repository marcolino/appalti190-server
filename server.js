const express = require("express");
const path = require("path");
const cors = require("cors");
const i18next = require("i18next");
const backend = require("i18next-node-fs-backend");
const i18nextMiddleware = require("i18next-http-middleware");
const { logger, colors } = require("./src/controllers/logger.controller");
const db = require("./src/models");
const { assertEnvironment } = require("./src/helpers/environment");
const { setupEmail, notification } = require("./src/helpers/notification");
const { nowLocaleDateTime } = require("./src/helpers/misc");
const config = require("./src/config");

const production = (process.env.NODE_ENV === "production");
const testing = typeof global.it === "function"; // testing (mocha/chai/...)

// setup I18N
i18next
  .use(backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    debug: false,
    backend: {
      loadPath: __dirname + "/src/locales/{{lng}}/{{ns}}.json"
    },
    fallbackLng: config.languages.default,
    preload: [config.languages.default]
  })
;
    
const app = express();

// enable CORS, and whitelist our domains
app.use(cors({
  origin: Object.keys(config.clientDomains).map(domain => config.clientDomains[domain]),
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
  req.version = req.headers["accept-version"];
  next();
});

// use i18n
app.use(i18nextMiddleware.handle(i18next));

// environment configuration
if (production) { // load environment variables from .env file
  logger.info(`Activating ${colors.BgGreen} production ${colors.Reset} environment`);
  require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
} else { // load environment variables from .env.test file
  logger.info(`Activating ${colors.BgYellow} test ${colors.Reset} environment`);
  require("dotenv").config({ path: path.resolve(__dirname, "./.env.test") });
}

// setup email
setupEmail();

// assert environment to be fully compliant with expectations
assertEnvironment();

// set up database connection uri
const connUri =
  production ?
    // production db uri
    `${process.env.MONGO_SCHEME}://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}/${process.env.MONGO_DB}` :
  testing ?
    // test db uri
    `${process.env.MONGO_SCHEME}://${process.env.MONGO_URL}/${process.env.MONGO_DB_TEST}`
  :
    // development db uri
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

// handle not found routes
// app.use((req, res, next) => {
// });
app.all("/api/*", (req, res, next) => {
  res.status(404);
  if (req.accepts("json")) {
    return res.json({ error: "Not found" });
  }
  return res.type("txt").send("Not found");
})

// serve the static files from the client - "client" is a link to the frontend site
const rootClient = path.join(__dirname, "client", "build");
app.use(express.static(rootClient));
const rootServer = path.join(__dirname, config.job.outputBasePath);
app.use(express.static(rootServer));

// set port and listen for requests
if (require.main === module) { // avoid listening while testing
  const PORT = process.env.PORT || config.api.port;
  app.listen(PORT, () => {
    //console.log(`Server is running on port ${PORT}`);
    logger.info(`Server is running on port ${PORT}`);
    notification({subject: "Startup", html: `Server is running on port ${PORT} on ${nowLocaleDateTime()}`});
  });
} else { // export app for testing
  module.exports = app;
}
