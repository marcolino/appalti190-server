const sgMail = require("@sendgrid/mail");
const config = require("../config");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendemail = (mailOptions) => {
  //console.log("sgMail.send options:", mailOptions);
  return new Promise((resolve, reject) => {
    sgMail.send(mailOptions, (error, result) => {
      //console.log("sgMail.send response:", error, result);
      if (error) return reject(error);
      return resolve(result);
    });
  });
};

module.exports = {
  sendemail: async (mailOptions) => {
    sendemail(mailOptions);
  },
  assertionsCheckFailure: async (body) => {
    const subject = `${config.realm} ~ Controllo asserzione fallito`;
    const to = config.emailAdministration.to;
    const from = config.emailAdministration.from;
    const html = body;
    console.log(`sending email to: ${to} from: ${from}, subject: ${subject}, body: ${html}`);
    try {
      await sendemail({to, from, subject, html});
    } catch(error) {
      console.error("Error sending email:", error);
    }
  },
}