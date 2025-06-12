const PDFDocument = require('pdfkit');
const fs = require('fs');

function generateTareasPDF(tareas, filePath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(18).text('Lista de Tareas', { align: 'center' });
    doc.moveDown();

    tareas.forEach((tarea, idx) => {
      doc.fontSize(12).text(
        `${idx + 1}. ${tarea.titulo} - ${tarea.descripcion || ''} - Estado: ${tarea.estado} - Fecha Inicio: ${tarea.fecha_inicio} - Fecha Finalización: ${tarea.fecha_finalizacion} - Hora Inicio: ${tarea.hora_inicio} - Hora Finalización: ${tarea.hora_finalizacion} - Empleado: ${tarea.empleado_id || 'No asignado'}`,
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

module.exports = { generateTareasPDF };