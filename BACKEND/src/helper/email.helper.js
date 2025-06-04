const nodemailer = require('nodemailer');


async function sendTareasEmail(to, subject, text, attachmentPath) {
  // Configura tu transporte SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail', // O el servicio que uses
    auth: {
      user: 'waltra2@gmail.com',
      pass: 'fafs oorf tncb hgeu'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: 'waltra2@gmail.com',
    to,
    subject,
    text,
    attachments: [
      {
        filename: 'tasks.pdf',
        path: attachmentPath
      }
    ]
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendTareasEmail };