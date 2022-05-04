const stripeModule = require("stripe");
const stripe = stripeModule(
  (process.env.STRIPE_MODE === "production") ?
    process.env.STRIPE_API_KEY_LIVE
  :
    process.env.STRIPE_API_KEY_DEV
  )
;
const config = require("../config");

module.exports = app => {
  app.post("/create-checkout-session", async (req, res, next) => {
    const product = req.body.product;
    console.log("/create-checkout-session product:", product);
    console.log("/create-checkout-session product price id:", config.stripe.products[product].price_id);
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // the price id of the product to sell
          price: config.stripe.products[product].price_id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: config.stripe.paymentSuccessUrl,
      cancel_url: config.stripe.paymentCancelUrl,
    });
  
    res.redirect(303, session.url);
  });
  
  app.get("/payment-success", async (req, res) => {
    logger.info(`Payment success`);
    res.redirect(config.stripe.paymentSuccessUrlClient);
  });
  
  app.get("/payment-cancel", async (req, res) => {
    logger.info(`Payment cancel`);
    res.redirect(config.stripe.paymentCancelUrlClient);
  });
};
