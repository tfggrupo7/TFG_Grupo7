const PDFDocument = require("pdfkit");
const fs = require("fs");

// Formatea la fecha a dd/mm/yyyy
function formatearFecha(fecha) {
  if (!fecha) return "";
  // Si es un objeto Date
  if (fecha instanceof Date) {
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }
  // Si es un número (timestamp)
  if (typeof fecha === "number") {
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const anio = d.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }
  // Si es string
  if (typeof fecha === "string") {
    // Si ya está en formato dd-mm-yyyy o dd/mm/yyyy
    if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(fecha)) {
      return fecha.replace(/-/g, "/");
    }
    // Si está en formato yyyy-mm-dd
    const match = fecha.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return `${match[3]}/${match[2]}/${match[1]}`;
    }
    return fecha;
  }
  return "";
}

// Agrupa tareas por empleado_id
function agruparPorEmpleado(tareas) {
  return tareas.reduce((acc, tarea) => {
    const id = tarea.empleado_id || "No asignado";
    if (!acc[id]) acc[id] = [];
    acc[id].push(tarea);
    return acc;
  }, {});
}

function generateTareasPDF(tareas, filePath) {
  return new Promise((resolve, reject) => {
    const tareasPorEmpleado = agruparPorEmpleado(tareas);

    const doc = new PDFDocument({
      margin: 30,
      size: "A4",
      layout: "landscape",
    });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .fillColor("#3730a3")
      .text("Lista de tareas de empleados", { align: "center" });
    doc.moveDown(1.5);

    // Colores
    const headerBg = "#e6ecd3";
    const headerText = "#4b5320";
    const rowText = "#222";
    const borderColor = "#e0e0e0";

    // Columnas
    const colWidths = [90, 170, 80, 100, 70, 100, 70, 60];
    const headers = [
      "Título",
      "Descripción",
      "Fecha Inicio",
      "Fecha Finalización",
      "Hora Inicio",
      "Hora Finalización",
      "Estado",
      "", // Papelera
    ];

    let y = doc.y;

    Object.entries(tareasPorEmpleado).forEach(
      ([empleadoId, tareasEmpleado]) => {
        // Encabezado de empleado
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .fillColor("#6b8e23")
          .text(`Empleado ID: ${empleadoId}`, 30, y);
        y += 18;

        // Encabezado de tabla
        let x = 30;
        headers.forEach((header, i) => {
          doc
            .rect(x, y, colWidths[i], 22)
            .fillAndStroke(headerBg, borderColor)
            .fillColor(headerText)
            .font("Helvetica-Bold")
            .fontSize(10)
            .text(header, x + 4, y + 6, {
              width: colWidths[i] - 8,
              align: "left",
            });
          x += colWidths[i];
        });
        y += 22;

        // Filas de tareas
        tareasEmpleado.forEach((tarea) => {
          x = 30;
          const values = [
            tarea.titulo || "",
            tarea.descripcion || "",
            formatearFecha(tarea.fecha_inicio),
            formatearFecha(tarea.fecha_finalizacion),
            tarea.hora_inicio || "",
            tarea.hora_finalizacion || "",
            tarea.estado || "",
            "", // Placeholder for trash icon
          ];
          values.forEach((value, i) => {
            doc.rect(x, y, colWidths[i], 20).stroke(borderColor);

            if (i === 7) {
              // Draw trash icon if available
              try {
                doc.image("trash.png", x + 8, y + 4, { width: 12, height: 12 });
              } catch (e) {
                // If image not found, leave blank or handle error
              }
            } else {
              doc
                .fillColor(rowText)
                .font("Helvetica")
                .fontSize(10)
                .text(value, x + 4, y + 5, {
                  width: colWidths[i] - 8,
                  align: "left",
                });
            }
            x += colWidths[i];
          });
          y += 20;

          // Salto de página si es necesario
          if (y > 750) {
            doc.addPage();
            y = 30;
          }
        });

        y += 18; // Espacio entre empleados
      }
    );

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", (err) => reject(err));
  });
}

module.exports = { generateTareasPDF };
