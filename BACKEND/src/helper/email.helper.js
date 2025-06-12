const nodemailer = require('nodemailer');


// Ahora la función espera un array de tareas, no de empleados
async function sendTareasEmail(to, subject, text, attachmentPath) {


  // Configura tu transporte SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'waltra2@gmail.com',
      pass: 'fafs oorf tncb hgeu'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: 'ChefDesk',
    to,
    subject,
    text,
    
    attachments: [
      {
        filename: 'tareas.pdf',
        path: attachmentPath
      }
    ]
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendTareasEmail };