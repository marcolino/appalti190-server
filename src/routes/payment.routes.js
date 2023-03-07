/**
 * Stripe payment routes implementation
 */
const { authJwt } = require("../middlewares");
const paymentController = require("../controllers/payment.controller");

module.exports = app => {
  app.get("/api/payment/mode", [authJwt.verifyToken], paymentController.getMode);
  app.post("/api/payment/create-checkout-session", [authJwt.verifyToken], paymentController.createCheckoutSession);
  app.get("/api/payment/payment-success", /*[authJwt.verifyToken], */ paymentController.paymentSuccess);
  app.get("/api/payment/payment-cancel", /*[authJwt.verifyToken], */ paymentController.paymentCancel);
};
