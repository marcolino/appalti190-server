const { get, set, upload, transformXls2Xml, validateXml, outcomeCheck, outcomeFailureDetails, getPlans } = require("../controllers/job.controller");

const { authJwt } = require("../middlewares");
const xmlvalidator = require("xsd-schema-validator"); // TODO: debug only
const path = require("path"); // TODO: debug only
const fs = require("fs"); // TODO: debug only
const config = require("../config"); // TODO: debug only

module.exports = app => {

  app.get("/api/job/get", authJwt.verifyToken, async(req, res, next) => {
    const [err, result] = await get(req, res, next);
console.log("Successfully get job:", result);
    return err ? res.status(500).json(err) : res.status(200).json({result});
  });

  app.put("/api/job/set", authJwt.verifyToken, async(req, res, next) => {
//console.log("JOBS ROUTE job:", req.body.job);
    const [err, result] = await set(req, res, next);
//console.log("Successfully set job:", result);
    return err ? res.status(500).json(err) : res.status(200).json({result});
  });

  app.post("/api/job/upload", authJwt.verifyToken, async(req, res, next) => {
    upload.single("file")(req, res, err /* can't we pass next here ??? */ => {
//console.log("route /api/job/upload upload result:", err, req.file);
      return err ? res.status(501).json(err) : res.status(200).json({ message: "Successfully uploaded file", file: req.file });
    })
  });
  
  app.post("/api/job/transformXls2Xml/:filePath", authJwt.verifyToken, async(req, res, next) => {
    const [err, result] = await transformXls2Xml(req, res, next);
    console.log("Successfully transformXls2Xml:", Object.keys(result));
    return err ? res.status(500).json(err) : res.status(200).json({result});
  });

  app.post("/api/job/validateXml/:transform", authJwt.verifyToken, async(req, res, next) => {
//     const xml = req.body.transform.xml;
//     //const xml = '<foo:bar />';
//     const schema = path.join(__dirname, "../..", config.job.schemaFile);
//     // try { 
// console.log("ValidateXML...");
//       xmlvalidator.validateXML(xml, schema, (err, result) => {
//         if (err) {
// console.error("V ERR:", err.message);
//           return res.status(200).json({result: err.message});
//           //return reject(`Errore parsing XML: ${err.message}`);
//         }
//         if (!result.valid) {
// console.error("V VAL:", result);
//           return res.status(200).json({result});
//           //return reject(`Errore validazione XML: ${result}`);
//         }
// console.error("V OK:", result);
//         return res.status(200).json({result});
//       });
// //     } catch(err) {
// // console.error("V CATCH:", err);
// //       console.error("xmlvalidator.validateXML error:", err);
// //       return res.status(500).json(`Problema nella validazione xml: ${JSON.stringify(err)}`);
// //     }

    try {
      const result = await validateXml(req, res, next);
      res.status(200).json(result); // TODO - was: json({result}) ...
    } catch (err) {
console.error("validateXml exception:", err.message, Object.keys(err), Object.values(err), typeof err);
      res.status(500).json(err);
    }

    // const [err, result] = await validateXml(req, res, next);
    // console.log("Result from validateXml:", err, result);
    // return err ? res.status(err.response.status/* <- TODO: check... 500*/).json(err) : res.status(200).json({result});
  });

  app.post("/api/job/outcomeCheck/:anno/:codiceFiscaleAmministrazione", authJwt.verifyToken, async(req, res, next) => {
    const result = await outcomeCheck(req, res, next);
    //console.log("Result from outcomeCheck:", err, result);
console.log("Result from outcomeCheck result:", result);
    return res.status(200).json(result);
  });

  app.post("/api/job/outcomeFailureDetails/:anno?/:identificativoPEC?", authJwt.verifyToken, async(req, res, next) => {
    const [err, result] = await outcomeFailureDetails(req, res, next);
    console.log("Result from outcomeFailureDetails:", Object.keys(result));
    return err ? res.status(500).json(err) : res.status(200).json({result});
  });

  app.get("/api/job/getPlans", async(req, res, next) => {
    const [err, result] = await getPlans(req, res, next);
    //console.log("Result from getPlans:", result);
    return err ? res.status(500).json(err) : res.status(200).json(result);
  });

};

// router.post("/upload", multerUpload.single("file"), async(req, res) => {
//   console.log("/upload REQ ***:", req.file);
//     res.status(200).json({ message: "Successfully uploaded file", file: req.file });
//   });