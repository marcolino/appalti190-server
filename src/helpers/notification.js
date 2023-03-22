const sgMail = require("@sendgrid/mail");
const config = require("../config");

const setupEmail = () => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const sendemail = (mailOptions) => {

  if (process.env.NODE_ENV === "test") { // in test mode do not send emails
    return Promise.resolve(true);
  }

  // set defaults
  if (!mailOptions.to) mailOptions.to = process.env.FROM_EMAIL;
  if (!mailOptions.from) mailOptions.from = process.env.FROM_EMAIL;

  mailOptions.subject = `${config.api.name}${mailOptions.subject ? " ~ " : ""}${mailOptions.subject}`;
  return new Promise((resolve, reject) => {
    sgMail.send(mailOptions, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });
  });
};

const assertionsCheckFailure = async (body) => {
  const subject = `Controllo asserzione fallito`;
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

const notification = async ({subject, html}) => {
  if (process.env.NODE_ENV !== "production") return; // notify only in production
  html = html ? html : subject;
  const to = config.emailAdministration.to;
  const from = config.emailAdministration.from;
  try {
    await sendemail({to, from, subject, html});
  } catch(error) {
    console.error("Error sending email:", error, error.response.body.errors);
  }
};

module.exports = {
  setupEmail,
  sendemail,
  assertionsCheckFailure,
  notification,
};

