const multer = require("multer");
const { get, set, upload, transformXls2Xml, validateXml, outcomeCheck, outcomeFailureDetails, urlExistenceAndMatch, getPlans } = require("../controllers/job.controller");
const { authJwt } = require("../middlewares");

module.exports = app => {

  app.get("/api/job/get", authJwt.verifyToken, async(req, res, next) => {
    const [err, result] = await get(req, res, next);
    return err ? res.status(500).json(err) : res.status(200).json({result});
  });

  app.put("/api/job/set", authJwt.verifyToken, async(req, res, next) => {
    const [err, result] = await set(req, res, next);
    return err ? res.status(500).json(err) : res.status(200).json({result});
  });

  app.post("/api/job/upload", authJwt.verifyToken, async(req, res, next) => {
    upload.single("file")(req, res, err => {
      if (next instanceof multer.MulterError) {
        // a Multer error occurred when uploading
        res.status(500).json(err);
      } else if (err) {
        // an unknown error occurred when uploading
        res.status(500).json(err);
      }
      // everything was fine
      return res.status(200).json({ message: "Successfully uploaded file", file: req.file });
    })
  });
  
  app.post("/api/job/transformXls2Xml/:filePath", authJwt.verifyToken, async(req, res, next) => {
    try {
      const result = await transformXls2Xml(req, res, next);
      res.status(200).json({result});
    } catch (err) {
      res.status(500).json(err);
    }
});

  app.post("/api/job/validateXml/:transform", authJwt.verifyToken, async(req, res, next) => {
    try {
      const result = await validateXml(req, res, next);
      res.status(200).json({result});
    } catch (err) {
      res.status(500).json(err);
    }
  });

  app.post("/api/job/outcomeCheck/:anno/:codiceFiscaleAmministrazione", authJwt.verifyToken, async(req, res, next) => {
    const [err, result] = await outcomeCheck(req, res, next);
    return err ? res.status(500).json(err) : res.status(200).json({result});
  });

  app.post("/api/job/outcomeFailureDetails/:anno?/:identificativoPEC?", authJwt.verifyToken, async(req, res, next) => {
    const [err, result] = await outcomeFailureDetails(req, res, next);
    return err ? res.status(500).json(err) : res.status(200).json({result});
  });

  app.post("/api/job/urlExistenceAndMatch/:url/:fileToMatch", authJwt.verifyToken, async(req, res, next) => {
    const [err, result] = await urlExistenceAndMatch(req, res, next);
    return err ? res.status(500).json(err) : res.status(200).json(result);
  });

  app.get("/api/job/getPlans", async(req, res, next) => {
    const [err, result] = await getPlans(req, res, next);
    return err ? res.status(500).json(err) : res.status(200).json(result);
  });

};