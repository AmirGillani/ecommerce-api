const nodeMailer = require("nodemailer");
const HttpsErrors = require("../models/https-errors");

async function sendEmail(obj) {

  const transporter = nodeMailer.createTransport({
    service: "gmail",
    port:465,
    secure: false,
    auth: {
      user: "515amirhussainshah@gmail.com",
      pass: "sily xwqb qube rskl",
    },
  });


  const mailOptions = {
    from: "515amirhussainshah@gmail.com",
    to: obj.to,
    subject: obj.subject,
    text: obj.message,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
