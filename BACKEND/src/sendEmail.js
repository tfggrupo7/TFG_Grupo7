const nodemailer = require('nodemailer');

module.exports = async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'waltra2@gmail.com',
      pass: 'fafs oorf tncb hgeu'
    },
    tls: {
    rejectUnauthorized: false
  }
  });

  await transporter.sendMail({
    from: '"ChefDesk" <tuemail@gmail.com>',
    to,
    subject,
    text

  });
};