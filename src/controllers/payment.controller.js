/**
 * Stripe payment controller implementation
 */

const stripeModule = require("stripe");
const { logger } = require("../controllers/logger.controller");
const config = require("../config");

const stripe = stripeModule(
  (process.env.STRIPE_MODE === "live") ?
    process.env.STRIPE_API_KEY_LIVE
  :
    process.env.STRIPE_API_KEY_TEST
  )
;

exports.getMode = async(req, res) => {
  res.status(200).json({mode: process.env.STRIPE_MODE});
};

exports.createCheckoutSession = async(req, res) => {
  // TODO: create ../controllers/payment.controller.js ...
  const product = req.body.product;
  //console.log("create-checkout-session product:", product);
  //console.log("create-checkout-session product price id:", config.payment.stripe.products[product].price_id);
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
      success_url: `${config.payment.stripe.paymentSuccessUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.payment.stripe.paymentCancelUrl}?session_id={CHECKOUT_SESSION_ID}`,
    });
    //console.log("create-checkout-session session:", session);
    if (!session?.url) { // incomplete response, we miss the redirect url
      //console.error("create-checkout-session error: no session url");
      logger.error(`Payment session creation error: no session url`);
      return res.status(400).json({message: "no session url", code: "NO_SESSION_URL"});
    }

    logger.info(`Payment session created`);
    res.status(200).json({session, product}); // return the session with the redirect url instead of redirecting directly
  } catch(e) {
    logger.error(`Payment session creation error: ${JSON.stringify(e)}`);
    res.status(400).json(e);
  }
};

exports.paymentSuccess = async(req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    const customer = session.customer ? await stripe.customers.retrieve(session.customer) : null;
    const items = await stripe.checkout.sessions.listLineItems(session.id);
    const product = items.data[0].description;
    logger.info(`Payment successful for product ${product}${customer ? ` by customer ${customer.email}` : ""}`);
    res.redirect(config.payment.stripe.paymentSuccessUrlClient + `?product=${product}`);
  } catch (err) {
    logger.error(`error retrieving stripe info on payment success callback: ${err.getMessage()}`);
    res.redirect(config.payment.stripe.paymentSuccessUrlClient + `?product=&error=${err.getMessage()}`);
  }
};

exports.paymentCancel = async(req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    const customer = session.customer ? await stripe.customers.retrieve(session.customer) : null;
    const items = await stripe.checkout.sessions.listLineItems(session.id);
    const product = items.data[0].description;
    logger.info(`Payment canceled for product ${product}${customer ? ` by customer ${customer.email}` : ""}`);
    res.redirect(config.payment.stripe.paymentCancelUrlClient + `?product=${product}`);
  } catch (err) {
    logger.error(`error retrieving stripe info on payment cancel callback: ${err.getMessage()}`);
    res.redirect(config.payment.stripe.paymentCancelUrlClient + `?product=&error=${err.getMessage()}`);
  }
};
