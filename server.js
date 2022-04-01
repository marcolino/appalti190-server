const express = require("express");
const path = require("path");
const cors = require("cors");
const db = require("./src/models");
const { assertEnvironment } = require("./src/helpers/environment");
const config = require("./src/config");

const app = express();

let corsOptions = {
  // origin: [
  //   "http://localhost:8082", // bezkoder react-refresh-token-hooks client app
  //   "http://localhost:3000", // appalti190 client app (while developing, in production we are on same origin)
  // ],
  origin: config.corsDomains,
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// add default headers
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept, x-access-token, x-user-language",
  );
  next();
});

// handle client preferred language (please place this middleware before declaring any routes)
app.use((req, res, next) => {
  // read the accept-language header and return the language if found or false if not
//console.log("Accept-Language:", req.get('Accept-Language'));
//console.log("x-user-language:", req.get("x-user-language"));
  let language;
  config.languages.every((lang, index) => { // list of backend supported languages; the last one is the fallback
    //language = req.acceptsLanguages(lang);
    language = req.get("x-user-language");
    if (language) return false; // break
    return true;
  });
  req.language = language;
  //console.log("LANGUAGE PREFERRED BY CLIENT:", req.language);
  next();
})

//const Role = db.role;

// TODO...
// use environment configuration
if (process.env.NODE_ENV !== "production") { // load environment variables from .env file in non production environments
  require("dotenv").config({ path: path.resolve(__dirname, "./.env") }) // TODO: test if we need this...
}
assertEnvironment();

// set up database connection uri
const connUri = (process.env.NODE_ENV === "production") ?
  //process.env.MONGO_LOCAL_CONN_URL :
  `${process.env.MONGO_SCHEME}://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}/${process.env.MONGO_DB}` :
  `${process.env.MONGO_SCHEME}://${process.env.MONGO_URL}/${process.env.MONGO_DB}`
;

db.mongoose
  //.connect(`mongodb://${config.db.HOST}:${config.db.PORT}/${config.db.DB}`, {
  .connect(connUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB");
    db.populate()
  })
  .catch(err => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
  })
;

// root route
// app.get("/", (req, res) => {
//   res.json({ message: `Welcome to ${config.api.name} application` });
// });

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
const PORT = process.env.PORT || config.api.port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// function initial() {
//   Role.estimatedDocumentCount((err, count) => {
//     if (!err && count === 0) {

//       db.ROLES.map(role => {
//         new Role({
//           name: role
//         }).save(err => {
//           if (err) {
//             console.error(`error saving role ${role}: ${err}`);
//             process.exit(-1);
//           }
//           console.log(`added ${role} to roles collection`);
//         });
//       });

//       // new Role({
//       //   name: "user"
//       // }).save(err => {
//       //   if (err) {
//       //     console.log("error", err);
//       //   }
//       //   console.log("added 'user' to roles collection");
//       // });

//       // new Role({
//       //   name: "moderator"
//       // }).save(err => {
//       //   if (err) {
//       //     console.log("error", err);
//       //   }
//       //   console.log("added 'moderator' to roles collection");
//       // });

//       // new Role({
//       //   name: "admin"
//       // }).save(err => {
//       //   if (err) {
//       //     console.log("error", err);
//       //   }
//       //   console.log("added 'admin' to roles collection");
//       // });
//     }
//   });
// }
