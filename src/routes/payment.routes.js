/**
 * Stripe payment routes implementation
 */

const stripeModule = require("stripe");
const { logger } = require("../controllers/logger.controller");
const { authJwt } = require("../middlewares");
const config = require("../config");

const stripe = stripeModule(
  (process.env.STRIPE_MODE === "live") ?
    process.env.STRIPE_API_KEY_LIVE
  :
    process.env.STRIPE_API_KEY_TEST
  )
;

module.exports = app => {
  app.get("/api/payment/mode", [authJwt.verifyToken], async (req, res, next) => {
console.log("MODE:", process.env.STRIPE_MODE);
    res.status(200).json({mode: process.env.STRIPE_MODE});
  });

  app.post("/api/payment/create-checkout-session", [authJwt.verifyToken], async (req, res, next) => {

    // TODO: create ../controllers/payment.controller.js ...
    const product = req.body.product;
    console.log("create-checkout-session product:", product);
    console.log("create-checkout-session product price id:", config.payment.stripe.products[product].price_id);
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // the price id of the product to sell
            price: config.payment.stripe.products[product].price_id,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${config.payment.stripe.paymentSuccessUrl}?product=${product}`,
        cancel_url: `${config.payment.stripe.paymentCancelUrl}?product=${product}`,
      });
      console.log("create-checkout-session session:", session);
      if (!session?.url) { // incomplete response, we miss the redirect url
        //console.error("create-checkout-session error: no session url");
        logger.error(`create-checkout-session error: no session url`);
        return res.status(400).json({message: "no session url", code: "NO_SESSION_URL"});
      }

      // TODO: update user's plan in db...

      //res.redirect(303, session.url);

      logger.info(`Payment success`);
      res.status(200).json({session, product}); // return the session with the redirect url instead of redirecting directly
    } catch(e) {
      //console.error("create-checkout-session error:", e?.raw?.message);
      logger.error(`Payment error: ${JSON.stringify(e)}`);
      res.status(400).json(e);
    }
  });
  
  // app.get("/api/payment/payment-success", async (req, res) => {
  //   logger.info(`**************** Payment success`, req, res);
  //   res.redirect(config.payment.stripe.paymentSuccessUrlClient);
  // });
  
  // app.get("/api/payment/payment-cancel", async (req, res) => {
  //   logger.info(`Payment cancel`);
  //   res.redirect(config.payment.stripe.paymentCancelUrlClient);
  // });
};
