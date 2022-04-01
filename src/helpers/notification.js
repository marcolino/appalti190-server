const sgMail = require("@sendgrid/mail");
const config = require("../config");

const sendemail = /*async*/ (mailOptions) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY); // TODO: we should call this outside this function, but outside we do not have process.env yet...
  console.log("SENDGRID_API_KEY:", process.env.SENDGRID_API_KEY);

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
    await sendemail({to, from, subject, html});
  } catch(error) {
    console.error("Error sending email:", error, error.response.body.errors);
  }
};

module.exports = {
  sendemail,
  assertionsCheckFailure,
};
