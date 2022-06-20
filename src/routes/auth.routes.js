const { verifySignUp, verifySignIn } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.post(
    "/api/auth/signup",
    [
      //verifySignUp.checkDuplicateUsername,
      verifySignUp.checkDuplicateEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );
  app.post("/api/auth/signupConfirm", controller.signupConfirm);
  app.post("/api/auth/signin",
    [
      verifySignIn.checkValidEmail,
    ],
    controller.signin
  );
  app.post("/api/auth/resendSignUpCode", controller.resendSignUpCode);
  app.post("/api/auth/resetPassword/:email", controller.resetPassword);
  app.post("/api/auth/resetPasswordConfirm/:email/:password/:code", controller.resetPasswordConfirm);
  app.post("/api/auth/resendResetPasswordCode", controller.resendResetPasswordCode);
  app.post("/api/auth/refreshtoken", controller.refreshToken);
};
