//const versioning = require("express-routes-versioning");
const { authJwt } = require("../middlewares");
const userController = require("../controllers/user.controller");

// handle versioning
//const versionRoutes = versioning();

module.exports = app => {
  // app.use(function(req, res, next) {
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "x-access-token, Origin, Content-Type, Accept"
  //   );
  //   next();
  // });

  app.get("/api/user/getProfile", authJwt.verifyToken, userController.getProfile);

  app.post("/api/user/updateProfile", authJwt.verifyToken, userController.updateProfile);

//  app.get("/api/user/getPlan", authJwt.verifyToken, userController.getPlan);

  app.post("/api/user/updateRoles", [authJwt.verifyToken, authJwt.isAdmin], userController.updateRoles);

  app.post("/api/user/updatePlan", [authJwt.verifyToken, authJwt.isAdmin], userController.updatePlan);

  app.get(
    "/api/admin/getAdminPanel",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.adminPanel // do not use versioning
    /* to use versioning:
    versionRoutes({
      "^1": userController.adminPanel,
      "^2": userController.adminPanelV2,
    }, NoMatchFoundCallback),
     */
  );

  app.get(
    "/api/user",
    //[authJwt.verifyToken, authJwt.isAdmin], // TODO: handle auth in controller and uncomment this
    userController.users
  );

  app.get("/api/test/all", userController.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], userController.userBoard);

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.adminBoard
  );
};
