const sgMail = require("@sendgrid/mail");
const { nowLocaleDateTime, remoteAddress } = require("../helpers/misc");
const config = require("../config");

const sendemail = (mailOptions) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY); // TODO: we should call this outside this function, but outside we do not have process.env yet...
  //console.log("SENDGRID_API_KEY:", process.env.SENDGRID_API_KEY);

  // set defaults
  if (!mailOptions.to) mailOptions.to = process.env.FROM_EMAIL;
  if (!mailOptions.from) mailOptions.from = process.env.FROM_EMAIL;
//console.log("sgMail.send options:", mailOptions);
  return new Promise((resolve, reject) => {
    sgMail.send(mailOptions, (error, result) => {
      //console.log("sgMail.send response:", error, result);
      if (error) return reject(error);
      return resolve(result);
    });
  });
};

const assertionsCheckFailure = async (body) => {
  const subject = `${config.api.name} ~ Controllo asserzione fallito`;
  const to = config.emailAdministration.to;
  const from = config.emailAdministration.from;
  const html = body;
  console.log(`sending email to: ${to} from: ${from}, subject: ${subject}, body: ${html}`);
  try {
    console.info("sending email:", to, from, subject);
    await sendemail({to, from, subject, html});
  } catch(error) {
    console.error("Error sending email:", error, error.response.body.errors);
  }
};

const notification = async (subject, html) => {
  if (process.env.NODE_ENV !== "production") return; // notify only in production
  html = html ? html : subject;
  subject = `${config.api.name} ~ ${subject}`;
  const to = config.emailAdministration.to;
  const from = config.emailAdministration.from;
  try {
    await sendemail({to, from, subject, html});
  } catch(error) {
    console.error("Error sending email:", error, error.response.body.errors);
  }
};

module.exports = {
  sendemail,
  assertionsCheckFailure,
  notification,
};

