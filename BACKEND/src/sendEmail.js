const nodemailer = require('nodemailer');

module.exports = async function sendEmail(to, subject, text, htmlTemplate) {
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

  const path = require('path');
  await transporter.sendMail({
    from: '"ChefDesk" <tuemail@gmail.com>',
    to,
    subject: 'Recuperación de contraseña',
    html: htmlTemplate,
    text,
    attachments: [{
      filename: 'logoPNG.png',
      path: path.join(__dirname, 'images', 'logoPNG.png'),
      cid: 'logo'
    }]
  });
};