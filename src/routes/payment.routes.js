/**
 * Stripe payment routes implementation
 */
const { authJwt } = require("../middlewares");
const paymentController = require("../controllers/payment.controller");

module.exports = app => {
  app.get("/api/payment/mode", [authJwt.verifyToken], paymentController.getMode);
  app.post("/api/payment/createCheckoutSession", [authJwt.verifyToken], paymentController.createCheckoutSession);
  app.get("/api/payment/paymentSuccess", /*[authJwt.verifyToken], */ paymentController.paymentSuccess);
  app.get("/api/payment/paymentCancel", /*[authJwt.verifyToken], */ paymentController.paymentCancel);
};
