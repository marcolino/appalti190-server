const year = 2021; // the reference year (data/year is year + 1)
const titolo = "Pubblicazione 1 legge 190";
const abstract = "Pubblicazione 1 legge 190 anno 1 rif. 2012";
const licenza = "IODL";

module.exports = {
  api: {
    name: "Appalti190",
  },
  auth: {
    secret: "super-secret-banana-armadillo-666",
    //jwtExpiration: 3600, // 1 hour
    //jwtRefreshExpiration: 3600 * 24 * 30, // 1 month
    jwtExpiration: 1200, // 20 minutes - TEST ONLY
    jwtRefreshExpiration: 3600, // 1 hour - TEST ONLY
  },
  db: {
    HOST: "localhost",
    PORT: 27017,
    DB: "bezkoder_db"
  },
  languages: [ // list of backend supported languages; the last one is the fallback, and is mandatory here
    "it",
    "en",
  ],
  currency: "EUR", // default currency (ISO 4217:2015)
  job: {
    uploadsBasePath: "./uploads",
    outputBasePath: "/public/downloads", // TODO
    datasetMaximumSize: 5 * (1024 * 1024), // TODO
    xsi_schemaLocation: "legge190_1_0 datasetAppaltiL190.xsd", // xsi schemaLocation attribute
    xmlns_xsi: "http://www.w3.org/2001/XMLSchema-instance", // xmlns xsi attribute
    xmlns_legge190: "legge190_1_0", // xmlns legge190 attribute
    xmlHeader: { // keys order matters
      version: "1.0",
      encoding: "UTF-8",
      metadata: {
        titolo,
        abstract,
        dataPubblicazioneDataset: "", // compiled automatically from system date
        entePubblicatore: "", // compiled automatically from XLS
        dataUltimoAggiornamentoDataset: "", // YYYY-MM-DD, compiled automatically from XLS
        annoRiferimento: "", // compiled automatically from XLS
        urlFile: "", // compiled automatically from XLS
        licenza,
      },
      metadataIndice: {
        titolo,
        abstract,
        dataPubblicazioneIndice: "", // compiled automatically from system date
        entePubblicatore: "", // compiled automatically from XLS
        dataUltimoAggiornamentoIndice: "", // YYYY-MM-DD, compiled automatically from XLS
        annoRiferimento: "", // compiled automatically from XLS
        urlFile: "", // compiled automatically from XLS
        licenza,
      },
    },
    sheets: { // the input xls sheets names
      elencoGare: "ELENCO GARE",
      metadati: "METADATI",
    },
    sheetElencoGareHeaderRows: 2,
    correctCommonErrors: true,
  },
  emailAdministration: {
    from: "marcosolari+2@gmail.com",
    to: "marcosolari@gmail.com",
  },
  envRequiredVariables: [ // TODO: check all of these are necessary
    "JWT_ACCESS_TOKEN_SECRET",
    "JWT_REFRESH_TOKEN_SECRET",
    "JWT_ACCESS_TOKEN_EXPIRY",
    "JWT_REFRESH_TOKEN_EXPIRY",
    "MONGO_SCHEME",
    "MONGO_URL",
    "MONGO_DB",
    "MONGO_USER",
    "MONGO_PASS",
    "FROM_EMAIL",
    "GOOGLE_OAUTH_CLIENT_ID",
    "GOOGLE_OAUTH_CLIENT_SECRET",
    "FACEBOOK_OAUTH_CLIENT_ID",
    "FACEBOOK_OAUTH_SECRET_KEY",
    "SENDGRID_API_KEY",
    "STRIPE_API_KEY_DEV",
    "STRIPE_API_KEY_LIVE",
    "AWS_BUCKET_NAME",
    "AWS_REGION",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
  ],
}