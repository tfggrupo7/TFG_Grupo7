const nodemailer = require("nodemailer");


async function sendTurnosEmail(to, subject, text, attachmentPath) {
  // Configura tu transporte SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "waltra2@gmail.com",
      pass: "fafs oorf tncb hgeu",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: '"ChefDesk" <tuemail@gmail.com>',
    to,
    subject,
    text,

    attachments: [
      {
        filename: "turnos.pdf",
        path: attachmentPath,
      },
    ],
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendTurnosEmail };