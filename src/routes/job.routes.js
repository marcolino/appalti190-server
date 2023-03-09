const multer = require("multer");
//const { /*get, set, */upload, uploader, transformXls2Xml, validateXml, outcomeCheck, outcomeFailureDetails, urlExistenceAndMatch, getPlans } = require("../controllers/job.controller");
const jobController = require("../controllers/job.controller");
const { authJwt } = require("../middlewares");

module.exports = app => {
  app.post("/api/job/upload", authJwt.verifyToken, jobController.upload);
  app.post("/api/job/transformXls2Xml/:filePath", authJwt.verifyToken, jobController.transformXls2Xml);
  app.post("/api/job/validateXml/:transform", authJwt.verifyToken, jobController.validateXml);
  app.post("/api/job/outcomeCheck/:anno/:codiceFiscaleAmministrazione", authJwt.verifyToken, jobController.outcomeCheck);
  app.post("/api/job/urlExistenceAndMatch/:url/:fileToMatch", authJwt.verifyToken, jobController.urlExistenceAndMatch);
  app.get("/api/job/getPlans", jobController.getPlans);

  // app.get("/api/job/get", authJwt.verifyToken, async(req, res, next) => {
  //   const [err, result] = await get(req, res, next);
  //   return err ? res.status(500).json(err) : res.status(200).json({result});
  // });

  // app.put("/api/job/set", authJwt.verifyToken, async(req, res, next) => {
  //   const [err, result] = await set(req, res, next);
  //   return err ? res.status(500).json(err) : res.status(200).json({result});
  // });
  // app.post("/api/job/transformXls2Xml/:filePath", authJwt.verifyToken, async(req, res, next) => {
  //     try {
  //     const result = await transformXls2Xml(req, res, next);
  //     res.status(200).json({result});
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // });
  // app.post("/api/job/validateXml/:transform", authJwt.verifyToken, async(req, res, next) => {
  //   try {
  //     const result = await jobController.validateXml(req, res, next);
  //     res.status(200).json({result});
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // });
  // app.post("/api/job/outcomeCheck/:anno/:codiceFiscaleAmministrazione", authJwt.verifyToken, async(req, res, next) => {
  //     const [err, result] = await jobController.outcomeCheck(req, res, next);
  //   return err ? res.status(500).json(err) : res.status(200).json({result});
  // });
  // app.post("/api/job/outcomeFailureDetails/:anno?/:identificativoPEC?", authJwt.verifyToken, async(req, res, next) => {
  //   const [err, result] = await jobController.outcomeFailureDetails(req, res, next);
  //   return err ? res.status(500).json(err) : res.status(200).json({result});
  // });
  // app.post("/api/job/urlExistenceAndMatch/:url/:fileToMatch", authJwt.verifyToken, async(req, res, next) => {
  //   const [err, result] = await jobController.urlExistenceAndMatch(req, res, next);
  //   return err ? res.status(500).json(err) : res.status(200).json(result);
  // });
  // app.get("/api/job/getPlans", async(req, res, next) => {
  //   const [err, result] = await jobController.getPlans(req, res, next);
  //   return err ? res.status(500).json(err) : res.status(200).json(result);
  // });
};
