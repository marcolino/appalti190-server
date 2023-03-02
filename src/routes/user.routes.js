//const versioning = require("express-routes-versioning");
const { authJwt } = require("../middlewares");
const userController = require("../controllers/user.controller");

// handle versioning
//const versionRoutes = versioning();

module.exports = app => {
  app.get("/api/user", [authJwt.verifyToken, authJwt.isAdmin], userController.users);
  //app.get("/api/test/all", userController.allAccess);
  //app.get("/api/test/user", [authJwt.verifyToken], userController.userBoard);
  //app.get("/api/test/admin", [authJwt.verifyToken, authJwt.isAdmin], userController.adminBoard);
  app.get("/api/user/getProfile", authJwt.verifyToken, userController.getProfile);
  app.post("/api/user/updateProfile", authJwt.verifyToken, userController.updateProfile);
  app.post("/api/user/updateUserProperty", [authJwt.verifyToken/*, authJwt.isAdmin*/], userController.updateUserProperty);
  // app.get("/api/user/getPlan", authJwt.verifyToken, userController.getPlan);
  app.get("/api/user/getRoles", [authJwt.verifyToken], userController.getRoles);
  app.post("/api/user/updateRoles", [authJwt.verifyToken, authJwt.isAdmin], userController.updateRoles);
  app.post("/api/user/updatePlan", [authJwt.verifyToken, authJwt.isAdmin], userController.updatePlan);
  //app.post("/api/user/deleteAll", [authJwt.verifyToken, authJwt.isAdmin], userController.deleteAll); // BE CAREFUL HERE!!!
  app.get("/api/admin/getAdminPanel", [authJwt.verifyToken, authJwt.isAdmin], userController.adminPanel);
  /**
   * To use versioning:
   * 
   * versionRoutes({
   *   "^1": userController.adminPanel,
   *   "^2": userController.adminPanelV2,
   * }, NoMatchFoundCallback),
   */
};
