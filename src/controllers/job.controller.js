const path = require("path");
const fs = require("fs");
const multer = require("multer");
const xlsx = require("xlsx");
const xmlBuilder = require("xmlbuilder");
//const nodeZip = new require("node-zip")(); // nodeZip here, const zip = new nodeZip() below...
const nodeZip = require("node-zip"); // TODO: nodeZip here, const zip = new nodeZip() below...
const xmlvalidator = require("xsd-schema-validator");
const axios = require("axios");
const db = require("../models");
const User = db.models.user;
const Plan = db.models.plan;
const config = require("../config");

const zip = new nodeZip();

const get = async (req, res) => {
console.log("GET JOB.JOB - REQ.USERID:", req.userId);
  const user = await User.findOne(
    { _id: req.userId } // req.userId is from auth
  );
  if (!user) {
    return [ null, { tabId: 0 } ]; // only navigation;
  }
console.log("GET JOB.JOB - USER.JOB:", user.job);
  return [ null, user.job ];
};

const set = async (req, res) => {
//console.log("**** SET JOB - REQ.JOB:", req.body.job);
  const user = await User.findByIdAndUpdate(
    req.userId,
    { job: req.body.job },
  );
//console.log("SET JOB - USER:", user);
  if (!user) {
    return [ null, { tabId: 0 } ]; // only navigation;
  }
  return [ null, user.job ];
};

// multer custom file upload (folder with user name)
const upload = multer({
  storage: multer.diskStorage({
    destination: async(req, file, cb) => {
//console.log("upload REQ destination userid:", req.userId);
      const user = await User.findOne({ _id: req.userId }).exec();
//console.log("upload REQ destination user:", user);

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
      cb(null, `${new Date().toISOString().replace(/T/, "_").replace(/\..+/, "") }.xls`);
    }
  }),
  limits: {
    fileSize: 10000000, // TODO: in config, and handle overflows...
  },
});

const transformXls2Xml = async (req, res) => {
  const retval = {
    code: "OK",
    message: null,
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
    retval.message = `The user must be authenticated.`;
    retval.code = "ABORTED_DUE_TO_MISSING_AUTHENTICATION";
    return [null, retval]; // TODO: handle errors like this in the first return var...
  }
  if (!user.plan) {
    retval.message = `The user must have a plan.`;
    retval.code = "ABORTED_DUE_TO_MISSING_PLAN";
    return [null, retval];
  }

  // read input xls file into workbook
  const input = req.body.filePath;
  const workbook = xlsx.readFile(input, { cellDates: true });
console.log("workbook:", workbook);

  // parse the requested sheets
  const sheetElencoGare = xlsx.utils.sheet_to_json(workbook.Sheets[config.job.sheets.elencoGare], {
    header: false,
    blankrows: true,
  });

  if (!sheetElencoGare.length) {
console.log("sheetElencoGare vuoto");
    retval.errors.push(`Foglio ${config.job.sheets.elencoGare} non trovato`);
    retval.message = `Il file di input è corrotto, oppure vuoto.`;
    retval.code = "BROKEN_INPUT";
    return [null, retval];
  }

  const sheetMetadati = xlsx.utils.sheet_to_json(workbook.Sheets[config.job.sheets.metadati]);
  if (!sheetMetadati.length) {
    return retval.errors.push(`Foglio ${config.job.sheets.metadati} non trovato`);
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

  let today = new Date(); today = today.toISOString().split('T')[0];
  metadati.dataPubblicazioneDataset = today;

  // get last modification date of input file
  try {
    const stats = fs.statSync(input);
    const date = new Date(stats.mtime); metadati.dataUltimoAggiornamentoDataset = date.toISOString().split('T')[0];
  } catch (err) {
    retval.errors.push(`Impossibile leggere la data di ultima modifica del file di input ${input}: ${err.message}`);
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
      let error = `Riga CIG con il campo "Partecipanti" impostato a ${row["PARTECIPANTI"]}, si ignora`;
      //return retval.errors.push(`[attenzione] ${error} (${retval.rownum})`);
      return retval.warnings.push(`${error} (${retval.rownum})`);
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
      let error = `Riga CIG con il campo "Aggiudicatari" impostato a ${row["AGGIUDICATARI"]}, si ignora`;
      //return retval.errors.push(`[attenzione] ${error} (${retval.rownum})`);
      return retval.warnings.push(`${error} (${retval.rownum})`);
    }

    if (!("__EMPTY" in row) || !row["__EMPTY"]) {
      if (
        (row["PARTECIPANTI"] === "") &&
        (row["AGGIUDICATARI"] === "")
      ) {
        return; // empty row, just skip it, no warning
      }
      let error = `Almeno uno fra Codice Fiscale e Identificativo Estero è obbligatorio, si ignora`;
      //return retval.errors.push(`[attenzione] ${error} (${retval.rownum})`);
      return retval.warnings.push(`${error} (${retval.rownum})`);
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
//console.log("CIG COUNT CHECK - TRUNCATING - user.plan.cigNumberAllowed:", user.plan.cigNumberAllowed);
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
        let error = `Riga CIG con il campo "Oggetto" vuoto, si ignora`;
        //return retval.errors.push(`[attenzione] ${error} (${retval.rownum})`);
        return retval.warnings.push(`${error} (${retval.rownum})`);
      } else {
        oggetto = String(row["OGGETTO"]).trim();
      }

      let sceltaContraente = row["SCELTA CONTRAENTE"];
      if (typeof sceltaContraente === "undefined") {
        let error = `Riga CIG con il campo "Scelta Contraente" vuoto, si ignora`;
        //return retval.errors.push(`[attenzione] ${error} (${retval.rownum})`);
        return retval.warnings.push(`${error} (${retval.rownum})`);
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
        let error = `Riga CIG con il campo "Partecipanti" vuoto, si ignora`;
        //return retval.errors.push(`[attenzione] ${error} (${retval.rownum})`);
        return retval.warnings.push(`${error} (${retval.rownum})`);
      }
    
      if (config.job.correctCommonErrors) {
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
        let warning = `Trovata una riga di continuazione (senza CIG) senza un lotto (riga CIG precedente), si ignora`;
        return retval.warnings.push(`[${retval.rownum}] ${warning}`);
      }
      if (!("__EMPTY_1" in row)) {
        let warning = `Trovata una riga di continuazione (senza CIG) senza un Codice Fiscale/ID Estero, si ignora`;
        return retval.warnings.push(`[${retval.rownum}] ${warning}`);
      }

      if (isAggregate) { // an aggregate row
        if (isEstero(partecipanteCodiceFiscale)) {
          partecipante.identificativoFiscaleEstero = partecipanteCodiceFiscale;
        } else {
          partecipante.codiceFiscale = partecipanteCodiceFiscale;
        }
        partecipante = {
          //"codiceFiscale": partecipanteCodiceFiscale,
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
            //"codiceFiscale": partecipanteCodiceFiscale,
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
          //"codiceFiscale": partecipanteCodiceFiscale,
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
            //"codiceFiscale": partecipanteCodiceFiscale,
            "ragioneSociale": partecipanteRagioneSociale,
          };
          /**/if (!aggiudicatari) {
            aggiudicatari = {};
          }
          if (!("aggiudicatario" in aggiudicatari)) {
            aggiudicatari["aggiudicatario"] = [];
          }/**/
          aggiudicatari["aggiudicatario"].push(aggiudicatario);
        }

      }

    }
  });

  if (retval.cigCount > user.plan.cigNumberAllowed) {
    retval.message = `The number of CIGs uploaded exeeds the number allowed by plan ${user.plan.name}, ${user.plan.cigNumberAllowed}.`;
    //retval.code = "TRUNCATED_DUE_TO_PLAN_LIMIT";
    retval.truncatedDueToPlanLimit = true;
console.log("user.plan:", user.plan)
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
console.log("xml.length:", xml.length, config.job.datasetMaximumSize);
    if (xml.length > config.job.datasetMaximumSize) { // we need a file indice, and split xml
console.log("lottiSlice1.length:", lottiSlice1.length);
      divideFactor *= 2;
      sliceSize = Math.ceil(lottiSlice1.length / divideFactor);
console.log("sliceSize:", sliceSize);
      lottiSlice1 = lottiSlice1.slice(0, sliceSize);
console.log("lottiSlice1.length:", lottiSlice1.length);
      xmlObj["legge190:pubblicazione"]["data"]["lotto"] = lottiSlice1;
    } else { // xml length is inside the maximum allowed size
console.log("BREAK");
      break;
    }
  } while (true);
console.log("OK");
  //xmls.push(xml); // the first xml is done already
  if (sliceSize > 0) { // we have to build xmls for all slices
console.log("SLICESIZE", sliceSize);
    xmls.push(xml);
    for (let dataset = 0; dataset < divideFactor; dataset++) {
      if (dataset >= 1) {
        let fromIndex = dataset * sliceSize;
        let toIndex = fromIndex + Math.min(sliceSize, lotti.length - fromIndex);
        let lottiSlice = lotti.slice(fromIndex, toIndex); // TODO: check il last lotti are included...
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

      // save dataset xml
      // let outputFolder = path.join(__dirname, "..", config.job.outputBasePath, encodeURIComponent(req.auth.user));
      // let outputFile = path.basename(datasetLink);
      // let error = save(outputFolder, outputFile, xml); // TODO: we can remove this
      // if (error) {
      //   retval.errors.push(`[errore] ${error}`);
      //   return retval;
      // }
      // add dataset to zip
      zip.file(path.basename(datasetLink), xml);
    }

    // build and save indici xml
    let xmlIndice = createXML(xmlObjIndice);
    // let outputFolder = path.join(__dirname, "..", config.job.outputBasePath, encodeURIComponent(req.auth.user));
    // let outputFile = path.basename(xmlObjIndice["indici"].metadata.urlFile);
    // let error = save(outputFolder, outputFile, xmlIndice); // TODO: we can remove this
    // if (error) {
    //   retval.errors.push(`[errore] ${error}`);
    //   return retval;
    // }

    // add indice to zip
    zip.file(path.basename(xmlObjIndice["indici"].metadata.urlFile), xmlIndice);

    // serialize zip archive
    let fileName = path.basename(xmlObj["legge190:pubblicazione"].metadata.urlFile).replace(/\.xml$/, `.zip`);
    let folderName = path.join(__dirname, "..", "..", config.job.outputBasePath, config.job.outputDownloads, user.email);
    let urlPath = path.join(config.job.outputDownloads, user.email, fileName);
    let result = serializeArchive(folderName, fileName, urlPath, zip);
    if (result.error) {
      retval.errors.push(result.error);
      return [null, retval];
    }
    retval.xmls = xmls;
    retval.xmlIndice = xmlIndice;
    retval.outputFile = result.outputFile;
    retval.outputUrl = result.outputUrl;
  } else { // there are no slices, just the single file
console.log("SLICESIZE ELSE", sliceSize);
    xmlObj["legge190:pubblicazione"]["data"]["lotto"] = lotti;
    datasetLink = `${xmlObj["legge190:pubblicazione"].metadata.urlFile}`; //.replace(/\.xml$/, `-${datasetTag}`)}.xml`;

    // build dataset xml
    xml = createXML(xmlObj);

    // serialize dataset xml
    let fileName = path.basename(datasetLink);
    //let folderName = path.join(__dirname, "..", "..", config.job.outputBasePath, encodeURIComponent("marco"/* TODO: RESTORE req.auth.user!!! req.auth.user*/));
console.log("USER:", user);
console.log("YEAR:", config.job.year);
    let folderName = path.join(__dirname, "..", "..", config.job.outputBasePath, config.job.outputDownloads, user.email);
    let urlPath = path.join(config.job.outputDownloads, user.email, fileName);
console.log("URL_PATH:", urlPath);
    let result = serializeDataset(folderName, fileName, urlPath, xml);

/* HERE!!! */ //retval.message = `Debug forced error!`; retval.code = "DEBUG FORCED ERROR"; return [null, retval];

    if (result.error) {
      retval.errors.push(result.error);
      return [null, retval];
    }
    //retval.xml = xml;
    /* retval.xml = xml; WE DON'T NEED XML ON THE CLIENT ... */
    //retval.xmlFilePath = folderName = path.join(folderName, fileName);

console.log("OUTPUT_URL:", result.outputUrl);
    retval.outputFile = result.outputFile;
    retval.outputUrl = result.outputUrl;

    /**
     * While developing, truncate xml to ease debug...
     */
    //retval.xml = (process.env.NODE_ENV !== "production") ? xml.substring(0, 256) : xml;

    // let outputFolder = path.join(__dirname, "..", config.job.outputBasePath, encodeURIComponent(req.auth.user));
    // let outputFile = path.basename(datasetLink);
    // let error = save(outputFolder, outputFile, xml);
    // if (error) {
    //   retval.errors.push(`[errore] ${error}`);
    //   return retval;
    // }
  }

  // TODO: should return only here!

/*
  // save job status to user
  //const user = await User.findOne({ _id: req.userId }).exec();
  user.job = {}; // TODO; job could exist...
  user.job.transform = retval;
  await user.save();
*/

  return [null, retval]; // TODO: we never use the first element of return array (error), change return type to object...
};

function createXML(xmlObj) {
  // create the XML tree
  const root = xmlBuilder.create(xmlObj, { version: config.job.xmlHeader.version, encoding: config.job.xmlHeader.encoding });

  // convert the XML tree to string
  return root.end({ pretty: true, allowEmpty: true });
}

// we need a function to consolidate lotto because it must be called on every new CIG row, AND at the end
function consolidate(xmlObj, lotto, raggruppamento, partecipanti, aggiudicatarioRaggruppamento, aggiudicatari) {
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
}

// save contents to file on disk
function save(folder, file, mode, contents) {
  try {
    if (!fs.existsSync(folder)) { // create folder if not present
      fs.mkdirSync(folder, { recursive: true });
    }
    if (fs.existsSync(path.join(folder, file))) {
      fs.unlinkSync(path.join(folder, file));
    }
    fs.writeFileSync(path.join(folder, file), contents, mode); // write the contents to file
    return true;
  } catch (err) {
    return err;
  }
}

// load contents from file on disk
function load(path) {
  try {
    const contents = fs.readFileSync(path, config.job.encoding); // read the contents from file
    return contents;
  } catch (err) {
    return err;
  }
}

// serialize zip archive to disk
function serializeArchive(outputFolder, outputFile, outputUrlPath, zip) {
  let contents = zip.generate({ base64: false, compression: 'DEFLATE' });
  //fs.writeFileSync(path.join(zipFolder, zipFile), zipContents, "binary");
  if ((result = save(outputFolder, outputFile, "binary", contents)) !== true) {
    return `${result}`;
  }
console.log("config.serverDomain:", config.serverDomain);
console.log("outputUrlPath:", outputUrlPath);
  return {
    error: null,
    outputFile: path.join(outputFolder, outputFile), //.replace(/^.*\/public\//, "")
    outputUrl: config.serverDomain + outputUrlPath,
  };
}

// serialize xml dataset to disk
function serializeDataset(outputFolder, outputFile, outputUrlPath, contents) {
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
function deserializeDataset(inputFilePath) {
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
function isEstero(codiceFiscale) {
  return String(codiceFiscale).match(/^[A-Z]{2}\w+$/i) !== null;
}

// validate XML
const validateXml = async (req, res) => {
//console.log("req.body:", Object.keys(req.body.transform));

  // TODO: handle xml's from filePath, not by contents... (see dataset case below)

  if (req.body.transform.xmlIndice) { // a zip archive with indice and datasets inside is present
    const xmlIndice = req.body.transform.xmlIndice;
    const xmls = req.body.transform.xmls;
    const schemaIndice = path.join(__dirname, "../..", config.schemaIndiceFile);
    const schema = path.join(__dirname, "../..", config.schemaFile);
    const promises = [];
    
    promises.push(validate(xmlIndice, schemaIndice));
    for (let i = 0; i < xmls.length; i++) {
      promises.push(validate(xmls[i], schema));
    }
    return Promise.all(promises);
  } else
  //if (req.body.transform.xml) { // a single xml dataset is present
  if (req.body.transform.outputFile/*xmlFilePath*/) { // a single xml dataset is present
      ///////////////////////////////////////////////////////////////////// storing only filename
    //const xml = req.body.transform.xml;
    const result = deserializeDataset(req.body.transform.outputFile/*xmlFilePath*/);
    if (result.error) {
      return {
        code: "CANNOT_READ_XML",
        message: result.error,
      };
//       retval.errors.push(result.error);
// console.log("ERROR1", result.error);
//       return [null, retval];
    }
//console.log("OUTPUT_URL:", result.outputUrl);
    //retval.outputFile = result.outputFile;
    const xml = result.contents;
    const schema = path.join(__dirname, "../..", config.job.schemaFile);
console.log("XML type:", typeof xml, 'len:', xml.length);

    return validate(xml, schema);
  } else { // no other cases allowed
    return {
      code: "XML_NOT_FOUND",
      message: "No zip archive nor xml dataset to be validated found",
    };
  }
};

async function validate(xml, schema) {
  return new Promise((resolve) => {
    xmlvalidator.validateXML(xml, schema, (err, result) => {
      if (err) {
        return resolve({code: "OK", message: `Error while validating XML: ${err.message}`});
      }
      if (!result.valid) {
        return resolve({code: "OK", message: `Invalid XML: ${result.message}`});
      }
      return resolve({code: "OK", message: `Valid XML`, result});
    });
  });
};

const outcomeCheck = async (req, res) => {
  const data = {
    anno: req.body.anno + 1,
    codiceFiscaleAmministrazione: req.body.codiceFiscaleAmministrazione,
    denominazioneAmministrazione: "", // not handled
    identificativoComunicazione: "", // not handled
  };
console.log("OUTCOMECHECK - config.job.outcomeUrl:", config.job.outcomeUrl);
  let answer = {};
  return await axios.post(config.job.outcomeUrl, data)
    .then(async(response) => {
console.log("OUTCOMECHECK - OK response:", response.data.result);

      const len = response?.data?.result?.length;
      if (len > 0) {
        answer = response.data.result[len - 1];
console.log("OUTCOMECHECK - ANSWER:", answer);
      }
      if (answer?.esitoUltimoTentativoAccessoUrl === "fallito") { // check did fail, get also failure details page
        const outcomeFailureDetailsBaseUrl = `${config.job.outcomeFailureDetailsBaseUrl}/${config.job.year + 1}/${answer.identificativoPEC}`;
console.log("OUTCOMECHECK - DETAILS URL:", outcomeFailureDetailsBaseUrl);
// "https://dati.anticorruzione.it/rest/legge190/dettaglio/2023/opec21004.20230127104028.29210.497.1.51@pec.aruba.it"
          // "headers": {
          //   "accept": "application/json, text/plain, */*",
          //   "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
          //   "cache-control": "no-cache",
          //   "pragma": "no-cache",
          //   "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Google Chrome\";v=\"101\"",
          //   "sec-ch-ua-mobile": "?0",
          //   "sec-ch-ua-platform": "\"Linux\"",
          //   "sec-fetch-dest": "empty",
          //   "sec-fetch-mode": "cors",
          //   "sec-fetch-site": "same-origin",
          //   "cookie": "_ga=GA1.2.1075427088.1674389486; GUEST_LANGUAGE_ID=it_IT; _gat=1",
          //   "Referer": "https://dati.anticorruzione.it/",
          //   "Referrer-Policy": "strict-origin-when-cross-origin"
          // },
        return await axios.get(outcomeFailureDetailsBaseUrl)
          .then(async(responseDetails) => {
            answer.esitoComunicazione = responseDetails?.data?.dati?.esitoComunicazione;
            answer.tentativiAccessoUrl = responseDetails?.data?.dati?.tentativiAccessoUrl;
console.log("OUTCOMECHECK DETAILS - OK:", answer);
            return [false, answer];
          })
          .catch(error => {
console.log("OUTCOMECHECK DETAILS - KO error:", error?.response?.statusText);
            //return [error.response.data ? new Error(error.response.data) : error];
            answer.esitoComunicazione = {};
            answer.esitoComunicazione.codice = "?";
            answer.esitoComunicazione.descrizione = error?.response?.status;
            answer.esitoComunicazione.dettaglio = error?.response?.statusText;
            answer.tentativiAccessoUrl = [];
            return [false, answer];
          })
        ;
      }
console.log("OUTCOMECHECK ANSWER *:", answer);
      return [false, answer];
    })
    .catch(error => {
console.log("OUTCOMECHECK - KO error:", error?.message, error?.response?.data?.message);
      //return [error.response.data ? new Error(error.response.data) : error];
      //answer = {error: error?.message, reason: error?.response?.data?.message};
      return [error, answer];
    })
  ;
};

const outcomeFailureDetails = async (req, res) => {
  const url = `${config.outcomeFailureDetailsBaseUrl}/${req.params.anno}/${req.params.identificativoPEC}`;
  return await axios.get(url)
    .then(response => {
      return [null, response.data];
    })
    .catch(error => {
      return error.message;
    })
  ;
};

const urlExistenceAndMatch = async (req, res) => {
  try {
    // read remote file
    const response = await axios.get(req.body.url);
    const remoteContents = response.data;
    console.log("urlExistenceAndMatch remoteContents length", remoteContents.length, typeof remoteContents);

    // read local file to compare
    const buffer = fs.readFileSync(req.body.fileToMatch);
    const localContents = buffer.toString();
    console.log("urlExistenceAndMatch localContents length", localContents.length, typeof localContents);

    // compare contents
    // if (localContents !== remoteContents) { // TODO: use this code!!! The next line is temporary!!!
    if (localContents.slice(localContents.length - 564) !== remoteContents.slice(remoteContents.length - 564) ) {
      return [false, {published: true, publishedAsIs: false}];
    }

    return [false, {published: true, publishedAsIs: true}];
  } catch (error) {
    console.log("urlExistenceAndMatch error:", error.message);// .response.status);
    return [error]; // return false for every status, in case of error...
  }
};

const getPlans = async (req, res) => {
  try {
    const retval = await Plan.find().sort({pricePerYear: 1}).lean(); // TODO: sort by pricePerYear LOW->HIGH
    return [null, retval];
  } catch(error) {
    return [error];
  }
};

module.exports = {
  get,
  set,
  upload,
  transformXls2Xml,
  validateXml,
  outcomeCheck,
  outcomeFailureDetails,
  urlExistenceAndMatch,
  getPlans,
};
