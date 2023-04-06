const path = require("path");
const fs = require("fs");
const multer = require("multer");
const xlsx = require("xlsx");
const xmlBuilder = require("xmlbuilder");
const nodeZip = require("node-zip");
const xmlvalidator = require("xsd-schema-validator");
const axios = require("axios");
const { logger } = require("./logger.controller");
const { nowLocaleDateTimeFilenameFormat } = require("../helpers/misc");
const User = require("../models/user.model");
const Plan = require("../models/plan.model");
const config = require("../config");

const zip = new nodeZip();

exports.upload = (req, res, next) => {
  // multer custom file upload (folder with user name)
  const multerUpload = multer({
    storage: multer.diskStorage({
      destination: async(req, file, cb) => {
        const user = await User.findOne({ _id: req.userId }).exec();
        const folder = path.join(config.job.uploadsBasePath, user.email);
        fs.mkdir(folder, { recursive: true }, (err) => {
          if (err) {
            if (err.code == "EEXIST") {
              cb(null, folder); // ignore the error if the folder already exists
            } else {
              cb(err, folder); // something else went wrong
            }
          } else {
            cb(null, folder); // successfully created folder
          }
        });
      },
      filename: (req, file, cb) => {
        cb(null, nowLocaleDateTimeFilenameFormat() + path.extname(file?.originalname) ?? "");
      }
    }),
    // fileFilter: (req, file, callback) => {
    //   const ext = path.extname(file.originalname);
    //   if (ext !== ".xls"'.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
    //       return callback(new Error('Only images are allowed'))
    //   }
    //   callback(null, true)
    // },
    fileFilter: (req, file, cb) => {
      const acceptedTypes = file.mimetype.split("/");
      if (acceptedTypes[0] === "application" && acceptedTypes[1].match(/spreadsheet/)) {
        cb(null, true);
      } else {
        //cb(null, false);
        cb(new Error(req.t("Only spreadsheets allowed")));
      }
    },
    limits: {
      fileSize: config.upload.maxFileSize,
    },
  });

  multerUpload.single("file")(req, res, err => {
    if (next instanceof multer.MulterError) {
      // a Multer error occurred when uploading
      return res.status(500).json(err.message);
    } else if (err) {
      // an unknown error occurred when uploading
      return res.status(400).json(err.message);
    }
    if (!req.file) {
      return res.status(400).json({ message: req.t("Requested file is undefined"), file: req.file });
    }

    // everything was fine
    return res.status(200).json({ message: "Successfully uploaded file", file: req.file });
  });
};

exports.transformXls2Xml = async(req, res) => {
  const retval = {
    code: "OK",
    message: "",
    rownum: 1, // we skip the xls header
    warnings: [],
    errors: [],
    header: null,
    metadati: null,
    xml: null,
    cigCount: 0,
    importoAggiudicazioneTotale: 0,
    importoSommeLiquidateTotale: 0,
  };

  // get current user for administrative reasons
  const user = await User.findOne(
    { _id: req.userId }
  )
    .populate("plan", "-__v")
  ;
  if (!user) {
    retval.message = req.t("The user must be authenticated");
    retval.code = "ABORTED_DUE_TO_MISSING_AUTHENTICATION";
    //return retval;
    return res.status(200).json(retval);
  }
  if (!user.plan) {
    retval.message = req.t("The user must have a plan");
    retval.code = "ABORTED_DUE_TO_MISSING_PLAN";
    //return retval;
    return res.status(200).json(retval);
  }

  // read input xls file into workbook
  const input = req.body.filePath;
  let workbook;
  try {
    workbook = xlsx.readFile(input, { cellDates: true });
  } catch(err) {
    retval.message = req.t("Error reading input file: {{error}}", {error: err.message});
    retval.code = "ABORTED_DUE_TO_ERROR_READING_INPUT_FILE";
    return res.status(200).json(retval);
  }

  // parse the requested sheets
  let sheetElencoGare;
  try {
    sheetElencoGare = xlsx.utils.sheet_to_json(workbook.Sheets[config.job.sheets.elencoGare], {
      header: false,
      blankrows: true,
    });
  } catch(err) {
    retval.errors.push(req.t("Sheet {{sheet}} not found", {sheet: config.job.sheets.elencoGare}));
    retval.message = req.t("Input file is corrupted");
    retval.code = "BROKEN_INPUT";
    return res.status(200).json(retval);
  }

  const sheetMetadati = xlsx.utils.sheet_to_json(workbook.Sheets[config.job.sheets.metadati]);
  if (!sheetMetadati.length) {
    retval.errors.push(req.t("Sheet {{sheet}} not found", {sheet: config.job.sheets.metadati}));
    retval.message = req.t("Input file is corrupted");
    retval.code = "BROKEN_INPUT";
    //return retval;
    return res.status(200).json(retval);
  }

  const metadati = config.job.xmlHeader.metadata;
  const header = {};
  let v = null;

  v = sheetMetadati.find(o => o.chiave === "codiceFiscaleStrutturaProponente");
  header.codiceFiscaleStrutturaProponente = ((v === undefined) ? null : v.valore);

  v = sheetMetadati.find(o => o.chiave === "denominazioneStrutturaProponente");
  header.denominazioneStrutturaProponente = (v === undefined) ? null : v.valore;

  v = sheetMetadati.find(o => o.chiave === "annoRiferimento"); v === undefined ? null : v.valore;
  metadati.annoRiferimento = (v === undefined) ? null : v.valore;

  v = sheetMetadati.find(o => o.chiave === "urlFile"); v === undefined ? null : v.valore;
  metadati.urlFile = (v === undefined) ? null : v.valore;

  // we assume "entePubblicatore" is the same as "strutturaProponente"
  metadati.entePubblicatore = header.denominazioneStrutturaProponente;

  let today = new Date(); today = today.toISOString().split("T")[0];
  metadati.dataPubblicazioneDataset = today;

  // get last modification date of input file
  try {
    const stats = fs.statSync(input);
    const date = new Date(stats.mtime); metadati.dataUltimoAggiornamentoDataset = date.toISOString().split("T")[0];
  } catch(err) {
    retval.errors.push(req.t("Can't read last modification date of input file {{input}}", {input}) + ": " + err.message);
    metadati.dataUltimoAggiornamentoDataset = today;
  }

  retval.metadati = metadati;
  retval.header = header;

  // define xmlObj object structure
  const xmlObj = {
    "legge190:pubblicazione": {
      "@xsi:schemaLocation": config.job.xsi_schemaLocation,
      "@xmlns:xsi": config.job.xmlns_xsi,
      "@xmlns:legge190": config.job.xmlns_legge190,
      "metadata": config.job.xmlHeader.metadata,
      "data": {
        "lotto": [],
      },
    },
  };

  // define xmlObj indice object structure
  xmlObjIndice = {
    "indici": {
      "@xsi:schemaLocation": config.job.xsi_schemaLocation,
      "@xmlns:xsi": config.job.xmlns_xsi,
      "@xmlns:legge190": config.job.xmlns_legge190,
      "metadata": config.job.xmlHeader.metadataIndice,
      "indice": {
        "dataset": [],
      },
    },
  };

  xmlObjIndice.indici.metadata.dataPubblicazioneIndice = metadati.dataPubblicazioneDataset
  xmlObjIndice.indici.metadata.dataUltimoAggiornamentoIndice = metadati.dataUltimoAggiornamentoDataset;
  xmlObjIndice.indici.metadata.annoRiferimento = metadati.annoRiferimento;
  xmlObjIndice.indici.metadata.entePubblicatore = metadati.entePubblicatore;
  xmlObjIndice.indici.metadata.urlFile = metadati.urlFile;

  // read elenco gare and build "lotto" elements in xmlObj object

  let lotto = null;
  let isAggregate = false;
  let isAggregateContinuation = false;
  let isAggiudicatario = false;
  let partecipanti = null;
  let partecipante = {};
  let raggruppamento = null; // raggruppamento MUST be after all partecipanti
  let aggiudicatari = null;
  let aggiudicatario = {};
  let aggiudicatarioRaggruppamento = null; // aggiudicatarioRaggruppamento MUST be after all aggiudicatari

  sheetElencoGare.forEach(row => {
    retval.rownum++;

    if (retval.rownum <= config.job.sheetElencoGareHeaderRows) { // skip headers row
      return;
    }

    if (!("PARTECIPANTI" in row)) {
      row["PARTECIPANTI"] = "";
      isAggregateContinuation = true;
    } else
    if (row["PARTECIPANTI"] === "A") {
      isAggregate = true;
      isAggregateContinuation = false;
    } else
    if (row["PARTECIPANTI"] === "S") {
      isAggregate = false;
      isAggregateContinuation = false;
    } else {
      let error = req.t("CIG row with \"Partecipanti\" field set to {{what}}, ignoring", {what: row["PARTECIPANTI"]});
      retval.warnings.push(`${error} (${retval.rownum})`);
      return;
    }

    if (!("AGGIUDICATARI" in row)) {
      row["AGGIUDICATARI"] = "";
      if (!isAggregateContinuation) {
        isAggiudicatario = false;
      }
    } else
    if (row["AGGIUDICATARI"] === "S") {
      isAggiudicatario = true;
    } else {
      let error = req.t("CIG row with \"Aggiudicatari\" field set to {{what}}, ignoring", {what: row["AGGIUDICATARI"]});
      retval.warnings.push(`${error} (${retval.rownum})`);
      return;
    }

    if (!("__EMPTY" in row) || !row["__EMPTY"]) {
      if (
        (row["PARTECIPANTI"] === "") &&
        (row["AGGIUDICATARI"] === "")
      ) {
        return; // empty row, just skip it, no warning
      }
      let error = req.t("At least one in \"Codice Fiscale\" and \"Identificativo Estero\" is mandatory, ignoring");
      retval.warnings.push(`${error} (${retval.rownum})`);
      return;
    }

    const partecipanteCodiceFiscale = row["__EMPTY"];
    const partecipanteRagioneSociale = row["__EMPTY_1"];
    const partecipanteRuolo = row["__EMPTY_2"];

    partecipante = {};
    aggiudicatario = {};
  
    if ("CIG" in row) { // a CIG row

      retval.cigCount++;

      // check if user's plan allows this many CIGs
      if (retval.cigCount > user.plan.cigNumberAllowed) {
        return; // continue, do not break, to count rows and CIGs
      }

      consolidate(xmlObj, lotto, raggruppamento, partecipanti, aggiudicatarioRaggruppamento, aggiudicatari);
      raggruppamento = null;
      partecipanti = null;
      aggiudicatarioRaggruppamento = null;
      aggiudicatari = null;

      let cig = row["CIG"];

      if (typeof cig !== "undefined") {
        cig = String(row["CIG"]).trim();
        //retval.errors.push(`[debug] ${retval.rownum} (${cig})`);
      }

      let oggetto = row["OGGETTO"];
      if (typeof oggetto === "undefined") {
        let error = req.t("CIG row with empty \"Oggetto\" field, ignoring");
        retval.warnings.push(`${error} (${retval.rownum})`);
        return
      } else {
        oggetto = String(row["OGGETTO"]).trim();
      }

      let sceltaContraente = row["SCELTA CONTRAENTE"];
      if (typeof sceltaContraente === "undefined") {
        let error = req.t("CIG row with empty \"Scelta Contraente\", ignoring");
        retval.warnings.push(`${error} (${retval.rownum})`);
        return;
      } else {
        sceltaContraente = String(row["SCELTA CONTRAENTE"]).trim();
      }

      let importoAggiudicazione = row["IMPORTO AGGIUDICAZIONE"] ? parseFloat(row["IMPORTO AGGIUDICAZIONE"]).toFixed(2) : parseFloat(0).toFixed(2);
      let importoSommeLiquidate = row["IMPORTO DELLE SOMME LIQUIDATE"] ? parseFloat(row["IMPORTO DELLE SOMME LIQUIDATE"]).toFixed(2) : parseFloat(0).toFixed(2);

      retval.importoAggiudicazioneTotale += parseFloat(importoAggiudicazione);
      retval.importoSommeLiquidateTotale += parseFloat(importoSommeLiquidate);

      let dataInizio = ("DATA INIZIO" in row) ? `${new Date(row["DATA INIZIO"]).getFullYear()}-${String(new Date(row["DATA INIZIO"]).getMonth()+1).padStart(2, "0")}-${String(new Date(row["DATA INIZIO"]).getDate()).padStart(2, "0")}` : undefined;
      if (dataInizio && dataInizio.includes("NaN")) { // check for bad format dates
        dataInizio = row["DATA INIZIO"]; // restore the original value, so the error is more clear
      }
      
      let dataUltimazione = ("DATA ULTIMAZIONE" in row) ? `${new Date(row["DATA ULTIMAZIONE"]).getFullYear()}-${String(new Date(row["DATA ULTIMAZIONE"]).getMonth()+1).padStart(2, "0")}-${String(new Date(row["DATA ULTIMAZIONE"]).getDate()).padStart(2, "0")}` : undefined;
      if (dataUltimazione && dataUltimazione.includes("NaN")) { // check for bad format dates
        dataUltimazione = row["DATA ULTIMAZIONE"]; // restore the original value, so the error is more clear
      }

      if (row["PARTECIPANTI"] === "") { // a CIG row MUST contain a PARTECIPANTI (A or S)
        let error = req.t("CIG row with empty \"Partecipanti\" field, ignoring");
        retval.warnings.push(`${error} (${retval.rownum})`);
        return;
      }
    
      if (config.job.correctCommonErrors) { // TODO: remove this code when good template is used!
        if (typeof oggetto !== "undefined") {
          oggetto = oggetto.substring(0, 250);
        }
        if (typeof sceltaContraente !== "undefined") {
          sceltaContraente = sceltaContraente.replace(/\s+DEL BANDO/, "");
          sceltaContraente = sceltaContraente.replace(/AFFIDAMENTO IN ECONOMIA\s+-\s+/, "");
          sceltaContraente = sceltaContraente.replace(/08-COTTIMO FIDUCIARIO/, "08-AFFIDAMENTO IN ECONOMIA - COTTIMO FIDUCIARIO");
          sceltaContraente = sceltaContraente.replace(/23-\s+AFFIDAMENTO DIRETTO/, "23-AFFIDAMENTO DIRETTO");
          sceltaContraente = sceltaContraente.replace(/01\s+-PROCEDURA APERTA/, "01-PROCEDURA APERTA");
        }
      }

      lotto = {
        "cig": cig,
        "strutturaProponente": {
          "codiceFiscaleProp": header.codiceFiscaleStrutturaProponente,
          "denominazione": header.denominazioneStrutturaProponente,
        },
        "oggetto": oggetto,
        "sceltaContraente": sceltaContraente,
        "partecipanti": {},
        "aggiudicatari": {},
        "importoAggiudicazione": importoAggiudicazione,
        "tempiCompletamento": {
          "dataInizio": dataInizio,
          "dataUltimazione": dataUltimazione,
        },
        "importoSommeLiquidate": importoSommeLiquidate,
      };

      if (isAggregate) { // an aggregate row
        if (isEstero(partecipanteCodiceFiscale)) {
          partecipante.identificativoFiscaleEstero = partecipanteCodiceFiscale;
        } else {
          partecipante.codiceFiscale = partecipanteCodiceFiscale;
        }
        partecipante.ragioneSociale = partecipanteRagioneSociale;
        partecipante.ruolo = partecipanteRuolo;
        // partecipante = {
        //   //"codiceFiscale": partecipanteCodiceFiscale,
        //   "ragioneSociale": partecipanteRagioneSociale,
        //   "ruolo": partecipanteRuolo,
        // };
        raggruppamento = {};
        raggruppamento["membro"] = [];
        raggruppamento["membro"].push(partecipante);

        if (isAggiudicatario) { // an aggiudicatario row
          if (isEstero(partecipanteCodiceFiscale)) {
            aggiudicatario.identificativoFiscaleEstero = partecipanteCodiceFiscale;
          } else {
            aggiudicatario.codiceFiscale = partecipanteCodiceFiscale;
          }
          aggiudicatario.ragioneSociale = partecipanteRagioneSociale;
          aggiudicatario.ruolo = partecipanteRuolo;
          // aggiudicatario = {
          //   //"codiceFiscale": partecipanteCodiceFiscale,
          //   "ragioneSociale": partecipanteRagioneSociale,
          //   "ruolo": partecipanteRuolo,
          // };
          aggiudicatarioRaggruppamento = {};
          aggiudicatarioRaggruppamento["membro"] = [];
          aggiudicatarioRaggruppamento["membro"].push(aggiudicatario);
        }
      } else { // a simple row
        if (isEstero(partecipanteCodiceFiscale)) {
          partecipante.identificativoFiscaleEstero = partecipanteCodiceFiscale;
        } else {
          partecipante.codiceFiscale = partecipanteCodiceFiscale;
        }
        partecipante.ragioneSociale = partecipanteRagioneSociale;
        // partecipante = {
        //   //"codiceFiscale": partecipanteCodiceFiscale,
        //   "ragioneSociale": partecipanteRagioneSociale,
        // };
        partecipanti = {};
        partecipanti["partecipante"] = [];
        partecipanti["partecipante"].push(partecipante);

        if (isAggiudicatario) { // an aggiudicatario row
          if (isEstero(partecipanteCodiceFiscale)) {
            aggiudicatario.identificativoFiscaleEstero = partecipanteCodiceFiscale;
          } else {
            aggiudicatario.codiceFiscale = partecipanteCodiceFiscale;
          }
          aggiudicatario.ragioneSociale = partecipanteRagioneSociale;
          // aggiudicatario = {
          //   //"codiceFiscale": partecipanteCodiceFiscale,
          //   "ragioneSociale": partecipanteRagioneSociale,
          // };
          aggiudicatari = {};
          aggiudicatari["aggiudicatario"] = [];
          aggiudicatari["aggiudicatario"].push(aggiudicatario);
        }
      }

    } else { // a continuation row

      if (!lotto) {
        let warning = req.t("Found a continuation row (with no CIG) without a \"lotto\" (previous CIG row), ignoring");
        retval.warnings.push(`[${retval.rownum}] ${warning}`);
        return;
      }
      if (!("__EMPTY_1" in row)) {
        let warning = `Trovata una riga di continuazione (senza CIG) senza un Codice Fiscale/ID Estero, si ignora`;
        retval.warnings.push(`[${retval.rownum}] ${warning}`);
        return;
      }

      if (isAggregate) { // an aggregate row
        if (isEstero(partecipanteCodiceFiscale)) {
          partecipante.identificativoFiscaleEstero = partecipanteCodiceFiscale;
        } else {
          partecipante.codiceFiscale = partecipanteCodiceFiscale;
        }
        partecipante = {
          "ragioneSociale": partecipanteRagioneSociale,
          "ruolo": partecipanteRuolo,
        };
        if (raggruppamento === null) {
          raggruppamento = {};
        }
        if (!("membro" in raggruppamento)) {
          raggruppamento["membro"] = [];
        }
        raggruppamento["membro"].push(partecipante);

        if (isAggiudicatario) { // an aggiudicatario row
          if (isEstero(partecipanteCodiceFiscale)) {
            aggiudicatario.identificativoFiscaleEstero = partecipanteCodiceFiscale;
          } else {
            aggiudicatario.codiceFiscale = partecipanteCodiceFiscale;
          }
          aggiudicatario = {
            "ragioneSociale": partecipanteRagioneSociale,
            "ruolo": partecipanteRuolo,
          };
          if (aggiudicatarioRaggruppamento === null) {
            aggiudicatarioRaggruppamento = {};
          }
          if (!("membro" in aggiudicatarioRaggruppamento)) {
            aggiudicatarioRaggruppamento["membro"] = [];
          }
          aggiudicatarioRaggruppamento["membro"].push(aggiudicatario);
        }
      } else { // a simple row
        if (isEstero(partecipanteCodiceFiscale)) {
          partecipante.identificativoFiscaleEstero = partecipanteCodiceFiscale;
        } else {
          partecipante.codiceFiscale = partecipanteCodiceFiscale;
        }
        partecipante = {
          "ragioneSociale": partecipanteRagioneSociale,
        };
        if (!partecipanti) {
          partecipanti = {};
        }
        if (!("partecipante" in partecipanti)) {
          partecipanti["partecipante"] = [];
        }
        partecipanti["partecipante"].push(partecipante);

        if (isAggiudicatario) { // an aggiudicatario row
          if (isEstero(partecipanteCodiceFiscale)) {
            aggiudicatario.identificativoFiscaleEstero = partecipanteCodiceFiscale;
          } else {
            aggiudicatario.codiceFiscale = partecipanteCodiceFiscale;
          }
          aggiudicatario = {
            "ragioneSociale": partecipanteRagioneSociale,
          };
          if (!aggiudicatari) {
            aggiudicatari = {};
          }
          if (!("aggiudicatario" in aggiudicatari)) {
            aggiudicatari["aggiudicatario"] = [];
          }
          aggiudicatari["aggiudicatario"].push(aggiudicatario);
        }

      }

    }
  });

  if (retval.cigCount > user.plan.cigNumberAllowed) {
    retval.message = `The number of CIGs uploaded exeeds the number allowed by plan ${user.plan.name}, ${user.plan.cigNumberAllowed}.`;
    //retval.code = "TRUNCATED_DUE_TO_PLAN_LIMIT";
    retval.truncatedDueToPlanLimit = true;
    retval.planCurrent = user.plan;

    // calculate minimum required plan
    const plans = await Plan.find().lean();
    retval.planRequired = plans.find(plan => plan.cigNumberAllowed >= retval.cigCount);
  }

  consolidate(xmlObj, lotto, raggruppamento, partecipanti, aggiudicatarioRaggruppamento, aggiudicatari);

  // round totals to 2 decimal positons (currency)
  retval.importoAggiudicazioneTotale = parseFloat(retval.importoAggiudicazioneTotale.toFixed(2));
  retval.importoSommeLiquidateTotale = parseFloat(retval.importoSommeLiquidateTotale.toFixed(2));

  // create xml, reducing contents while the size is less than maximum allowed size
  let lotti = xmlObj["legge190:pubblicazione"]["data"]["lotto"];
  let lottiSlice1 = lotti;
  let divideFactor = 1;
  let sliceSize = 0;
  let xmls = [];
  let xml;
  let datasetTag, datasetLink, datasetInfo;

  do {
    xml = createXML(xmlObj);
    if (xml.length > config.job.datasetMaximumSize) { // we need a file indice, and split xml
      divideFactor *= 2;
      sliceSize = Math.ceil(lottiSlice1.length / divideFactor);
      lottiSlice1 = lottiSlice1.slice(0, sliceSize);
      xmlObj["legge190:pubblicazione"]["data"]["lotto"] = lottiSlice1;
    } else { // xml length is inside the maximum allowed size
      break;
    }
  } while (true);

  //xmls.push(xml); // the first xml is done already
  if (sliceSize > 0) { // we have to build xmls for all slices
    xmls.push(xml);
    for (let dataset = 0; dataset < divideFactor; dataset++) {
      if (dataset >= 1) {
        let fromIndex = dataset * sliceSize;
        let toIndex = fromIndex + Math.min(sliceSize, lotti.length - fromIndex);
        let lottiSlice = lotti.slice(fromIndex, toIndex);
        xmlObj["legge190:pubblicazione"]["data"]["lotto"] = lottiSlice;
        // build dataset xml
        xml = createXML(xmlObj);
        xmls.push(xml);
      }

      // update indice
      datasetTag = (1 + dataset).toString().padStart(3, "0");
      datasetLink = `${xmlObj["legge190:pubblicazione"].metadata.urlFile.replace(/\.xml$/, `-${datasetTag}`)}.xml`;
      datasetInfo = {
        "@id": `dataset-${datasetTag}`,
        "linkDataset": datasetLink,
        "dataUltimoAggiornamento": xmlObj["legge190:pubblicazione"].metadata.dataUltimoAggiornamentoDataset,
      };
      xmlObjIndice["indici"].indice.dataset.push(datasetInfo);

      // add dataset to zip
      zip.file(path.basename(datasetLink), xml);
    }

    // build and save indici xml
    let xmlIndice = createXML(xmlObjIndice);

    // add indice to zip
    zip.file(path.basename(xmlObjIndice["indici"].metadata.urlFile), xmlIndice);

    // serialize zip archive
    let fileName = path.basename(xmlObj["legge190:pubblicazione"].metadata.urlFile).replace(/\.xml$/, `.zip`);
    let folderName = path.join(__dirname, "..", "..", config.job.outputBasePath, config.job.outputDownloads, user.email);
    let urlPath = path.join(config.job.outputDownloads, user.email, fileName);
    let result = serializeArchive(folderName, fileName, urlPath, zip);
    if (result.error) {
      retval.errors.push(result.error);
      retval.message = req.t("Error while archiving");
      retval.code = "ARCHIVE_ERROR";
      //return retval;
      return res.status(200).json(retval);
    }
    retval.xmls = xmls;
    retval.xmlIndice = xmlIndice;
    retval.outputFile = result.outputFile;
    retval.outputUrl = result.outputUrl;
  } else { // there are no slices, just the single file
    xmlObj["legge190:pubblicazione"]["data"]["lotto"] = lotti;
    datasetLink = `${xmlObj["legge190:pubblicazione"].metadata.urlFile}`; //.replace(/\.xml$/, `-${datasetTag}`)}.xml`;

    // build dataset xml
    xml = createXML(xmlObj);

    // serialize dataset xml
    let fileName = path.basename(datasetLink);
    let folderName = path.join(__dirname, "..", "..", config.job.outputBasePath, config.job.outputDownloads, user.email);
    let urlPath = path.join(config.job.outputDownloads, user.email, fileName);
    let result = serializeDataset(folderName, fileName, urlPath, xml);

    if (result.error) {
      retval.errors.push(result.error);
    } else {
      retval.outputFile = result.outputFile;
      retval.outputUrl = result.outputUrl;
    }
  }

  const errors = retval.errors.length;
  const warnings = retval.warnings.length;
  if (!retval.message) {
    if (errors > 0) {
      retval.message += `Transformazione completata con ${errors} errori`;
      if (warnings > 0) {
        retval.message += ` e ${warnins} avvisi`;
      }
    } else {
      if (warnings > 0) retval.message += `Transformazione completata con ${warnings} avvisi`;
    }
  }

  //return retval;
  return res.status(200).json(retval);
};

const createXML = (xmlObj) => {
  // create the XML tree
  const root = xmlBuilder.create(xmlObj, { version: config.job.xmlHeader.version, encoding: config.job.xmlHeader.encoding });

  // convert the XML tree to string
  return root.end({ pretty: true, allowEmpty: true });
};

// we need a function to consolidate lotto because it must be called on every new CIG row, AND at the end
const consolidate = (xmlObj, lotto, raggruppamento, partecipanti, aggiudicatarioRaggruppamento, aggiudicatari) => {
  if (lotto) { // consolidate previous lotto

    if (raggruppamento !== null) { // if any, push raggruppamento before partecipanti
      lotto["partecipanti"]["raggruppamento"] = raggruppamento;
      raggruppamento = null;
    }
    if (partecipanti !== null) { // if any, push partecipanti after raggruppamento
      lotto["partecipanti"]["partecipante"] = partecipanti.partecipante;
      partecipanti = null;
    }

    if (aggiudicatarioRaggruppamento !== null) { // if any, push aggiudicatarioRaggruppamento before aggiudicatari
      lotto["aggiudicatari"]["aggiudicatarioRaggruppamento"] = aggiudicatarioRaggruppamento;
      aggiudicatarioRaggruppamento = null;
    }
    if (aggiudicatari !== null) { // if any, push aggiudicatari after aggiudicatarioRaggruppamento
      lotto["aggiudicatari"]["aggiudicatario"] = aggiudicatari.aggiudicatario;
      aggiudicatari = null;
    }

    xmlObj["legge190:pubblicazione"]["data"]["lotto"].push(lotto);
  }
};

// save contents to file on disk
const save = (folder, file, mode, contents) => {
  try {
    if (!fs.existsSync(folder)) { // create folder if not present
      fs.mkdirSync(folder, { recursive: true });
    }
    if (fs.existsSync(path.join(folder, file))) {
      fs.unlinkSync(path.join(folder, file));
    }
    fs.writeFileSync(path.join(folder, file), contents, mode); // write the contents to file
    return true;
  } catch(err) {
    return err;
  }
}

// load contents from file on disk
const load = (path) => {
  try {
    const contents = fs.readFileSync(path, config.job.encoding); // read the contents from file
    return contents;
  } catch(err) {
    return err;
  }
}

// serialize zip archive to disk
const serializeArchive = (outputFolder, outputFile, outputUrlPath, zip) => {
  let contents = zip.generate({ base64: false, compression: "DEFLATE" });
  //fs.writeFileSync(path.join(zipFolder, zipFile), zipContents, "binary");
  if ((result = save(outputFolder, outputFile, "binary", contents)) !== true) {
    return `${result}`;
  }
  return {
    error: null,
    outputFile: path.join(outputFolder, outputFile), //.replace(/^.*\/public\//, "")
    outputUrl: config.serverDomain + outputUrlPath,
  };
}

// serialize xml dataset to disk
const serializeDataset = (outputFolder, outputFile, outputUrlPath, contents) => {
  if ((result = save(outputFolder, outputFile, /* use default mode*/ "", contents)) !== true) {
    return {
      error: result,
      outputFile: null,
      outputUrl: null,
    };
  } else {
    return {
      error: null,
      outputFile: path.join(outputFolder, outputFile),
      outputUrl: config.serverDomain + outputUrlPath,
    };
  };
}

// deserialize xml dataset from disk
const deserializeDataset = (inputFilePath) => {
  const contents = load(inputFilePath);
  if (contents instanceof Error) {
    return {
      error: contents.message,
      contents: null,
    };
  } else {
    return {
      error: null,
      contents
    };
  }
}

// check if codice fiscale is "estero"
const isEstero = (codiceFiscale) => {
  return String(codiceFiscale).match(/^[A-Z]{2}\w+$/i) !== null;
}

// validate XML
exports.validateXml = async(req, res) => {
  try {
    if (req.body?.transform?.xmlIndice) { // a zip archive with indice and datasets inside is present
      const xmlIndice = req.body?.transform?.xmlIndice;
      const xmls = req.body?.transform?.xmls;
      const schemaIndice = path.join(__dirname, "../..", config.job?.schemaIndiceFile);
      const schema = path.join(__dirname, "../..", config.job?.schemaFile);
      const promises = [];
      
      promises.push(validate(req, res, xmlIndice, schemaIndice));
      for (let i = 0; i < xmls.length; i++) {
        promises.push(validate(req, res, xmls[i], schema));
      }
      const results = await Promise.all(promises);
      if (results.filter(result => result.code === "OK").length === results.length) { // all results are OK
        //return results[0]; // return first result, all are ok
        return res.status(200).json(results[0]); // return first result, all are ok
      } else {
        //return results.find(result => result.code !== "OK");
        return res.status(200).json(results.find(result => result.code !== "OK"));
      }
    } else
    if (req.body?.transform?.outputFile) { // a single xml dataset is present
      const result = deserializeDataset(req.body?.transform?.outputFile);
      if (result.error) {
        // return {
        //   code: "CANNOT_READ_XML",
        //   message: result.error,
        // };
        return res.status(200).json({
          code: "CANNOT_READ_XML",
          message: result.error,
        });
      }
      const xml = result.contents;
      const schema = path.join(__dirname, "../..", config.job?.schemaFile);
      const validation = await validate(req, res, xml, schema);
      return res.status(200).json(validation);
    } else { // no other cases allowed
      return res.status(200).json({
        code: "XML_NOT_FOUND",
        message: req.t("No zip archive nor xml dataset to be validated found"),
      });
    }
  } catch(err) {
    return res.status(500).json(err);
  };
};

const validate = async(req, res, xml, schema) => {
  return new Promise((resolve) => {
      xmlvalidator.validateXML(xml, schema, (err, result) => {
      if (err) {
        return resolve({code: "ERROR", message: req.t("Error in XML validation"), errors: reclaimValidateMessage(err.message)});
      }
      if (!result.valid) {
        return resolve({code: "ERROR", message: req.t("Problems in XML validation"), errors: reclaimValidateMessage(result.message)});
      }
      return resolve({code: "OK", message: req.t("Valid XML")});
    });
  });
};

const reclaimValidateMessage = (message) => {
  const messages = message.split("\n");
  const pattern = /^\t\[([^\]]+)\]\s*([^:]*):\s*(.*)$/;
  messages.shift(); // first line is a title
  const reclaimedMessages = messages.map(message => {
    return `xml validation ${message.replace(pattern, "$1")} - ${message.replace(pattern, "$2")}: ${message.replace(pattern, "$3")}`;
  });
  return reclaimedMessages;
}

exports.outcomeCheck = async(req, res) => {
  const data = {
    anno: req.body.anno + 1,
    codiceFiscaleAmministrazione: req.body.codiceFiscaleAmministrazione,
    denominazioneAmministrazione: "", // not handled
    identificativoComunicazione: "", // not handled
  };
  let answer = {};
  return await axios.post(config.job.outcomeUrl, data)
    .then(async(response) => {

      const len = response?.data?.result?.length;
      if (len > 0) {
        answer = response.data.result[len - 1];
      }
      if (answer?.esitoUltimoTentativoAccessoUrl === "fallito") { // check did fail, get also failure details page
        const outcomeFailureDetailsBaseUrl = `${config.job.outcomeFailureDetailsBaseUrl}/${config.job.year + 1}/${answer.identificativoPEC}`;
        return await axios.get(outcomeFailureDetailsBaseUrl)
          .then(async(responseDetails) => {
            answer.esitoComunicazione = responseDetails?.data?.dati?.esitoComunicazione;
            answer.tentativiAccessoUrl = responseDetails?.data?.dati?.tentativiAccessoUrl;
            //return [null, answer];
            return res.status(200).json(answer);
          })
          .catch(err => {
            answer.esitoComunicazione = {};
            answer.esitoComunicazione.codice = "?";
            answer.esitoComunicazione.descrizione = err?.response?.status;
            answer.esitoComunicazione.dettaglio = err?.response?.statusText;
            answer.tentativiAccessoUrl = [];
            //return [null, answer];
            return res.status(200).json(answer);
          })
        ;
      }
      //return [null, answer];
      return res.status(200).json(answer);
    })
    .catch(err => {
      logger.error(`Error checking outcome url ${config.job.outcomeUrl}:`, err?.message ?? err);
      return res.status(err.response?.status ?? 400).json(err?.message ?? err);
    })
  ;
};

exports.outcomeFailureDetails = async(req, res) => {
  const url = `${config.outcomeFailureDetailsBaseUrl}/${req.params.anno}/${req.params.identificativoPEC}`;
  return await axios.get(url)
    .then(response => {
      //return [null, response.data];
      return res.status(200).json(response.data);
    })
    .catch(err => {
      logger.error(req.t("Error checking outcome details from url {{url}}", {url: config.job.outcomeFailureDetailsBaseUrl}) + ":", err?.response?.message ?? err?.request);
      return res.status(err.response?.status ?? 400).json(err?.response?.message ?? err?.request);
    })
  ;
};

exports.urlExistenceAndMatch = async(req, res) => {
  try {
    // read remote file
    const response = await axios.get(req.body.url);
    const remoteContents = response.data;

    try {
      // TODO: make comparison work for zip use case too...
      // read local file to compare
      const buffer = fs.readFileSync(req.body.fileToMatch);
      const localContents = buffer.toString();

      // compare contents (TODO: understand if and why we need config.job.publish.allowDateChangeInDataset ...)
      const bytesToIgnoreAtTheTopOfTheDatasets = (config.job?.publish?.allowDateChangeInDataset ? 564 : 0);
      if (localContents.slice(localContents.length - bytesToIgnoreAtTheTopOfTheDatasets) !== remoteContents.slice(remoteContents.length - bytesToIgnoreAtTheTopOfTheDatasets) ) {
        return res.status(200).json({published: true, publishedAsIs: false});
      }
      return res.status(200).json({published: true, publishedAsIs: true});
    } catch(err) {
      return res.status(err.status ?? 400).json(err.message ?? req.t("Unknown error"));
    }
  } catch(err) {
    return res.status(err.response?.status ?? 400).json(err.response?.statusText ?? req.t("Unknown error"));
  }
};
