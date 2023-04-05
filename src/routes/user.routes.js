const { authJwt } = require("../middlewares");
const userController = require("../controllers/user.controller");

module.exports = app => {
  app.get("/api/user/getAllUsersWithFullInfo", [authJwt.verifyToken, authJwt.isAdmin], userController.getAllUsersWithFullInfo);
  app.get("/api/user/getAllUsers", [authJwt.verifyToken, authJwt.isAdmin], userController.getAllUsers);
  app.get("/api/user/getProfile", authJwt.verifyToken, userController.getProfile);
  app.post("/api/user/updateProfile", authJwt.verifyToken, userController.updateProfile);
  app.post("/api/user/updateUserProperty", [authJwt.verifyToken/*, authJwt.isAdmin*/], userController.updateUserProperty);
  app.get("/api/user/getAllPlans", authJwt.verifyToken, userController.getAllPlans);
  app.get("/api/user/getAllRoles", [authJwt.verifyToken], userController.getAllRoles);
  app.post("/api/user/updateRoles", [authJwt.verifyToken/*, authJwt.isAdmin*/], userController.updateRoles);
  app.post("/api/user/updatePlan", [authJwt.verifyToken/*, authJwt.isAdmin*/], userController.updatePlan);
  app.post("/api/user/delete", [authJwt.verifyToken, authJwt.isAdmin], userController.delete); // be careful !
  app.post("/api/user/remove", [authJwt.verifyToken, authJwt.isAdmin], userController.remove);

  /**
   * To use versioning:
   * 
   * const versioning = require("express-routes-versioning");
   * 
   * // handle versioning
   * const versionRoutes = versioning();
   *
   * app.get("/api/getAllUsers", [authJwt.verifyToken, authJwt.isAdmin], versionRoutes({
   *   "^1": userController.getAllUsersWithFullInfo,
   *   "^2": userController.getAllUsersWithFullInfoV2,
   * }, NoMatchFoundCallback), // this callback is optional; it is called if requested version
   *                           // doesn't match the version provided in the options;
   *                           // if this callback is not provided latest version callback is called.
   * 
   * const NoMatchFoundCallback = () => {
   *   return userController.getAllUsersWithFullInfoV1,
   * }
   */
};
