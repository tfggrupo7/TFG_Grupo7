const PDFDocument = require("pdfkit");
const fs = require("fs");

// Formatea la fecha a dd/mm/yyyy
function formatearFecha(fecha) {
  if (!fecha) return "";
  if (fecha instanceof Date) {
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }
  if (typeof fecha === "number") {
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const anio = d.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }
  if (typeof fecha === "string") {
    if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(fecha)) {
      return fecha.replace(/-/g, "/");
    }
    const match = fecha.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return `${match[3]}/${match[2]}/${match[1]}`;
    }
    return fecha;
  }
  return "";
}

// Agrupa turnos por empleado_id
function agruparPorEmpleado(turnos) {
  return turnos.reduce((acc, turno) => {
    const id = turno.empleado_id;
    if (!acc[id]) {
      acc[id] = [];
    }
    acc[id].push(turno);
    return acc;
  }, {});
}

function generateTurnosPDF(turnos, filePath) {
  return new Promise((resolve, reject) => {
    const turnosFlat = Array.isArray(turnos[0]) ? turnos.flat() : turnos;

    const turnosValidos = turnosFlat.filter(
      (turno) =>
        turno &&
        typeof turno === "object" &&
        turno.hasOwnProperty("id") &&
        turno.hasOwnProperty("empleado_id") &&
        turno.empleado_id !== null &&
        turno.empleado_id !== undefined
    );

    if (turnosValidos.length === 0) {
      reject(new Error("No hay turnos válidos para procesar"));
      return;
    }

    const turnosPorEmpleado = agruparPorEmpleado(turnosValidos);

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
      .text("Lista de turnos de empleados", { align: "center" });
    doc.moveDown(1.5);

    // Colores
    const headerBg = "#e6ecd3";
    const headerText = "#4b5320";
    const rowText = "#222";
    const borderColor = "#e0e0e0";

    // Columnas
    const colWidths = [90, 170, 80, 100, 70, 100, 70];
    const headers = [
      "Día",
      "Hora_inicio",
      "Hora_fin",
      "Fecha",
      "Estado",
      "Empleado_id",
      "Acciones",
    ];

    let y = doc.y;
    const pageHeight = doc.page.height - doc.page.margins.top - doc.page.margins.bottom;
    const marginTop = doc.page.margins.top;

    // Función para dibujar encabezado de tabla
    function drawTableHeader() {
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
    }

    // Función para iniciar nueva página y repetir encabezados
    function addNewPage(empleadoId, nombreCompleto) {
      doc.addPage();
      y = marginTop;

      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#6b8e23")
        .text(`Empleado ID: ${empleadoId} - ${nombreCompleto}`, 30, y);
      y += 18;

      drawTableHeader();

      doc.font("Helvetica").fontSize(10);
    }

    Object.entries(turnosPorEmpleado).forEach(([empleadoId, turnosEmpleado]) => {
      const primerTurno = turnosEmpleado[0];

      const nombreCompleto =
        primerTurno.empleado_nombre && primerTurno.empleado_apellidos
          ? `${primerTurno.empleado_nombre} ${primerTurno.empleado_apellidos}`.trim()
          : primerTurno.empleado_nombre || "Sin nombre";

      // Encabezado de empleado con nombre
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#6b8e23")
        .text(`Empleado ID: ${empleadoId} - ${nombreCompleto}`, 30, y);
      y += 18;

      drawTableHeader();

      doc.font("Helvetica").fontSize(10);

      turnosEmpleado.forEach((turno) => {
        const values = [
          turno.dia || "",
          turno.hora_inicio || "",
          turno.hora_fin || "",
          formatearFecha(turno.fecha),
          turno.estado || "",
          turno.empleado_id || "",
          "",
        ];

        // Calcular altura máxima de la fila según contenido
        const heights = values.map((value, i) => {
          if (i === 6) return 20; // icono fijo
          return doc.heightOfString(String(value), {
            width: colWidths[i] - 8,
            align: "left",
            font: "Helvetica",
            size: 10,
          });
        });
        const rowHeight = Math.max(...heights, 20);

        // Salto de página si no cabe la fila completa
        if (y + rowHeight + 20 > pageHeight) { 
          addNewPage(empleadoId, nombreCompleto);
        }

        // Dibuja la fila
        let x = 30;
        values.forEach((value, i) => {
          doc.rect(x, y, colWidths[i], rowHeight).stroke(borderColor);

          if (i === 6) {
            try {
              doc.image("trash.png", x + 8, y + 4, { width: 12, height: 12 });
            } catch (e) {
              // Ignorar error si no existe la imagen
            }
          } else {
            doc.text(String(value), x + 4, y + 5, {
              width: colWidths[i] - 8,
              height: rowHeight - 10,
              align: "left",
              ellipsis: true,
            });
          }
          x += colWidths[i];
        });
        y += rowHeight;
      });

      y += 18; // Espacio entre empleados
    });

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", (err) => reject(err));
  });
}

module.exports = { generateTurnosPDF };