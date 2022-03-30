//const { multerUpload } = require("../controllers/job.controller");
const { upload, transformXls2Xml } = require("../controllers/job.controller");

module.exports = app => {
  app.post("/api/job/upload", upload.single("file"), async(req, res) => {
    //console.log("upload REQ ***:", req.file);
    res.status(200).json({ message: "Successfully uploaded file", file: req.file });
  });
  
  app.post("/api/job/transformXls2Xml/filePath", async(req, res, next) => {
    const result = await transformXls2Xml(req, res, next);
    console.log("Successfully transformXls2Xml:", Object.keys(result));
    return res.status(200).json({ message: "Ok", result});
  });
};

// router.post("/upload", multerUpload.single("file"), async(req, res) => {
//   console.log("/upload REQ ***:", req.file);
//     res.status(200).json({ message: "Successfully uploaded file", file: req.file });
//   });