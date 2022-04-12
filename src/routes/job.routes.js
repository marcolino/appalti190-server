const { upload, transformXls2Xml, validateXml, outcomeCheck, outcomeFailureDetails } = require("../controllers/job.controller");

const { authJwt } = require("../middlewares");

module.exports = app => {

  // app.post("/api/job/upload", upload.single("file"), async(req, res, err) => {
  //     //console.log("upload REQ ***:", req.file);
  //   res.status(200).json({ message: "Successfully uploaded file", file: req.file });
  // });
  app.post("/api/job/upload", authJwt.verifyToken, async(req, res) => {
    upload.single("file")(req, res, err => {
console.log("route /api/job/upload upload result:", err, req.file);
      return err ? res.status(500).json(err) : res.status(200).json({ message: "Successfully uploaded file", file: req.file });
    })
  });
  
  app.post("/api/job/transformXls2Xml/:filePath", authJwt.verifyToken, async(req, res, next) => {
    const [err, result] = await transformXls2Xml(req, res, next);
    console.log("Successfully transformXls2Xml:", Object.keys(result));
    return err ? res.status(500).json(err) : res.status(200).json({result});
  });

  // TODO: add authJwt.verifyToken to any route here...
  
  app.post("/api/job/validateXml/:transform", async(req, res, next) => {
    const [err, result] = await validateXml(req, res, next);
    console.log("Result from validateXml:", err, result);
    return err ? res.status(err.response.status/* <- TODO: check... 500*/).json(err) : res.status(200).json({result});
  });

  app.post("/api/job/outcomeCheck/:anno/:codiceFiscaleAmministrazione", async(req, res, next) => {
    const [err, result] = await outcomeCheck(req, res, next);
    //console.log("Result from outcomeCheck:", err, result);
    //console.log("Result from outcomeCheck err?.response?.status?.message:", err?.response?.status?.message);
    return err ? res.status(500).json(err) : res.status(200).json({result});
  });

  app.post("/api/job/outcomeFailureDetails/:anno?/:identificativoPEC?", async(req, res, next) => {
    const [err, result] = await outcomeFailureDetails(req, res, next);
    console.log("Result from outcomeFailureDetails:", Object.keys(result));
    return err ? res.status(500).json(err) : res.status(200).json({result});
  });

  
};

// router.post("/upload", multerUpload.single("file"), async(req, res) => {
//   console.log("/upload REQ ***:", req.file);
//     res.status(200).json({ message: "Successfully uploaded file", file: req.file });
//   });