const { authJwt } = require("../middlewares");
const userController = require("../controllers/user.controller");

module.exports = app => {
  // app.use(function(req, res, next) {
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "x-access-token, Origin, Content-Type, Accept"
  //   );
  //   next();
  // });

  app.get(
    "/api/admin/getAdminPanel",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.adminPanel
  );

  app.get(
    "/api/user",
    //[authJwt.verifyToken, authJwt.isAdmin], // TODO: handle auth in tests end uncomment this
    userController.users
  );

  app.get("/api/test/all", userController.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], userController.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    userController.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.adminBoard
  );
};
