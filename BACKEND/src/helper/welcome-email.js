const nodemailer = require("nodemailer");
const path = require('path');

// Crear el transporter
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

// Función para enviar emails
async function wellcome(to, subject, text) {
  const mailOptions = {
    from: '"ChefDesk" <waltra2@gmail.com>',
    to,
    subject,
    text,     
  };

  return transporter.sendMail(mailOptions);
}

// Función para enviar emails con HTML
async function sendHtmlEmail(to, subject, html) {
  const mailOptions = {
    from: '"ChefDesk" <waltra2@gmail.com>',
    to,
    subject,
    html, 
    attachments: [{
      filename: 'logoPNG.png',
      path: path.join(__dirname, 'images', 'logoPNG.png'),
      cid: 'logo'
    }]    
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { 
  wellcome, 
  sendHtmlEmail,
    transporter
 
};