const PDFDocument = require('pdfkit');
const fs = require('fs');

function generateTasksPDF(tasks, filePath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(18).text('Lista de Tareas', { align: 'center' });
    doc.moveDown();

    tasks.forEach((task, idx) => {
      doc.fontSize(12).text(
        `${idx + 1}. ${task.title} - ${task.description || ''} - Estado: ${task.status} - Fecha: ${task.due_date}`
      );
      doc.moveDown(0.5);
    });

    doc.end();

    stream.on('finish', () => {
      console.log('Stream finish, PDF escrito en disco');
      resolve(filePath);
    });
    stream.on('error', (err) => {
      console.error('Error en stream:', err);
      reject(err);
    });
  });
}

module.exports = { generateTasksPDF };