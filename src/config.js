const year = 2022; // the reference year (data/year is year + 1)
const titolo = "Pubblicazione 1 legge 190";
const abstract = "Pubblicazione 1 legge 190 anno 1 rif. 2012";
const licenza = "IODL";
const serverBaseUrl = `${process.env.NODE_ENV === "production" ?
  "https://appalti190.herokuapp.com" :
  "http://localhost:5000"
}`;
const clientAppalti190BaseUrl = `${process.env.NODE_ENV === "production" ?
  "https://appalti190.herokuapp.com" :
  "http://localhost:3000"
}`;
const clientShowcaseBaseUrl = `${process.env.NODE_ENV === "production" ?
  "https://appalti190-showcase.herokuapp.com" :
  "http://localhost:8080"
}`;
// const stripeMode = process.env.STRIPE_MODE;
// console.log("STRIPEMODE:", stripeMode);
// console.log("serverBaseUrl:", serverBaseUrl);
// console.log("process.env.NODE_ENV:", process.env.NODE_ENV); 

module.exports = {
  api: {
    name: "Appalti190",
    port: 5000,
    payloadLimit: "100mb",
  },
  auth: { // NEWFEATURE: put into environment (?)
    secret: "super-secret-banana-armadillo-666!",
    jwtExpirationSeconds: 3600, // 1 hour TTL
    jwtRefreshExpirationSeconds: 3600 * 24 * 30, // 1 month TTL
    verificationCodesExpirySeconds: 60 * 60 * 12, // 12 hours TTL
    codeDeliveryMedium: "email", // "email" / "sms" / ...
    passepartout: "passaquì,passalà", // passepartout password
  },
  db: {
    HOST: "localhost",
    PORT: 27017,
    DB: "appalti190",
  },
  logs: {
    file: "logs/appalti190.log", // logs and exceptions file
    papertrail: {
      host: "logs6.papertrailapp.com",
      port: 18466,
    },
  },
  languages: {
    supported: [ // list of backend supported languages; the last one is the fallback, and is mandatory here
      "en",
      "fr",
      "it",
    ],
    default: "en",
  },
  locale: "it", // server's locale (for dates)
  currency: "EUR", // default currency (ISO 4217:2015)
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10 MB
  },
  job: {
    year,
    encoding: "utf8", // files encodinf
    uploadsBasePath: "uploads",
    outputBasePath: "/public/",
    outputDownloads: "/downloads/",
    schemaFile: `./data/${year + 1}/datasetAppaltiL190.xsd`, // the xsd schema file (every new year must be manually downloaded new version from authority, and applied possible changes to code/data)
    schemaIndiceFile: `./data/${year + 1}/datasetIndiceAppaltiL190.xsd`, // the xsd indice schema file (every new year must be manually downloaded new version from authority, and applied possible changes to code/data)
    datasetMaximumSize: /*5*/1 * (1024 * 1024),
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
    publish: {
      allowDateChangeInDataset: true,
    },
    documentationUrl: "/docs/Specifiche Tecniche Legge 190 v1.3.pdf",
    outcomeUrlVisual: "https://dati.anticorruzione.it/#/l190",
    outcomeUrl: "https://dati.anticorruzione.it/rest/legge190/ricerca?max=20&start=0",
    outcomeFailureDetailsBaseUrl: "https://dati.anticorruzione.it/rest/legge190/dettaglio",
  },
  serverDomain: serverBaseUrl,
  clientDomains: [
    clientAppalti190BaseUrl,
    clientShowcaseBaseUrl,
  ],
  payment: {
    stripe: {
      products: (process.env.STRIPE_MODE === "live") ? { // stripe mode is production
        free: {
          name: "Appalti190 Gratuito LIVE",
          product_id: "prod_LC4k3rwA64D45l",
          price_id: "price_1KVgafFZEWHriL1u8PFSvxSy",
        },
        standard: {
          name: "Appalti190 Standard LIVE",
          product_id: "prod_LC4lYicsBXPmIA",
          price_id: "price_1KVgbfFZEWHriL1uR5BnWO9W",
        },
        unlimited: {
          name: "Appalti190 Illimitato LIVEKBJ",
          price_id: "price_1KVgdSFZEWHriL1udJubMAAn",
        },
      } : { // development
        free: {
          name: "Appalti190 Gratuito (test)",
          product_id: "prod_LC4q54jgFITE0U",
          price_id: "price_1KVggqFZEWHriL1uD8hlzL3S",
        },
        standard: {
          name: "Appalti190 Standard (test)",
          product_id: "prod_LC4tiakN3cKlSA",
          price_id: "price_1KVgjRFZEWHriL1ujZm3tF2h",
        },
        unlimited: {
          name: "Appalti190 Illimitato (test)",
          product_id: "prod_LC4og5H6lpSLoK",
          price_id: "price_1KVgfKFZEWHriL1utJyT904c",
        },
      },
      paymentSuccessUrl: "http://localhost:5000/api/payment/payment-success",
      paymentCancelUrl: "http://localhost:5000/api/payment/payment-cancel",
      paymentSuccessUrlClient: `${clientAppalti190BaseUrl}/payment-success`,
      paymentCancelUrlClient: `${clientAppalti190BaseUrl}/payment-cancel`,
      paymentSuccessUrlShowcase: `${clientShowcaseBaseUrl}/payment-success`,
      paymentCancelUrlShowcase: `${clientShowcaseBaseUrl}/payment-cancel`,
    },
  },
  emailAdministration: {
    //from: "marcosolari@gmail.com",
    from: "appalti190@arsistemi.it", // TODO: check if this works and avoid SPAM marks by gmail...
    to: "marcosolari@gmail.com",
  },
  envRequiredVariables: [ // TODO: clean up unused variables
    // "JWT_ACCESS_TOKEN_SECRET",
    // "JWT_REFRESH_TOKEN_SECRET",
    // "JWT_ACCESS_TOKEN_EXPIRY",
    // "JWT_REFRESH_TOKEN_EXPIRY",
    "MONGO_SCHEME",
    "MONGO_URL",
    "MONGO_DB",
    "MONGO_USER",
    "MONGO_PASS",
    "FROM_EMAIL",
    // "GOOGLE_OAUTH_CLIENT_ID",
    // "GOOGLE_OAUTH_CLIENT_SECRET",
    // "FACEBOOK_OAUTH_CLIENT_ID",
    // "FACEBOOK_OAUTH_SECRET_KEY",
    "SENDGRID_API_KEY",
    "STRIPE_MODE",
    "STRIPE_API_KEY_TEST",
    "STRIPE_API_KEY_LIVE",
    // "AWS_BUCKET_NAME",
    // "AWS_REGION",
    // "AWS_ACCESS_KEY_ID",
    // "AWS_SECRET_ACCESS_KEY",
  ],
};
