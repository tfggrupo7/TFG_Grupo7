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

function getEstadoTarea(tarea) {
  const ahora = new Date();
  const fechaInicio = new Date(`${tarea.fecha_inicio}T${tarea.hora_inicio}`);
  const fechaFin = new Date(`${tarea.fecha_finalizacion}T${tarea.hora_finalizacion}`);

  if (ahora < fechaInicio) {
    return "Pendiente";
  } else if (ahora >= fechaInicio && ahora <= fechaFin) {
    return "En Curso";
  } else if (ahora > fechaFin) {
    return "Completada";
  }
  return tarea.estado || "Pendiente";
}

// Agrupa tareas por empleado_id
function agruparPorEmpleado(tareas) {
  return tareas.reduce((acc, tarea) => {
    const id = tarea.empleado_id;
    if (!acc[id]) {
      acc[id] = [];
    }
    acc[id].push(tarea);
    return acc;
  }, {});
}

function generateTareasPDF(tareas, filePath) {
  
  return new Promise((resolve, reject) => {
    const tareasFlat = Array.isArray(tareas[0]) ? tareas.flat() : tareas;

    const tareasValidas = tareasFlat.filter(
      (tarea) =>
        tarea &&
        typeof tarea === "object" &&
        tarea.hasOwnProperty("empleado_id") &&
        tarea.empleado_id !== null &&
        tarea.empleado_id !== undefined
    );

    if (tareasValidas.length === 0) {
      reject(new Error("No hay tareas válidas para procesar"));
      return;
    }

    const tareasPorEmpleado = agruparPorEmpleado(tareasValidas);

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

    Object.entries(tareasPorEmpleado).forEach(([empleadoId, tareasEmpleado]) => {
      const primeraTarea = tareasEmpleado[0];

      const nombreCompleto =
        primeraTarea.empleado_nombre && primeraTarea.empleado_apellidos
          ? `${primeraTarea.empleado_nombre} ${primeraTarea.empleado_apellidos}`.trim()
          : primeraTarea.empleado_nombre || "Sin nombre";

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

      // Encabezado de empleado con nombre
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#6b8e23")
        .text(`Empleado ID: ${empleadoId} - ${nombreCompleto}`, 30, y);
      y += 18;

      drawTableHeader();

      doc.font("Helvetica").fontSize(10);

      tareasEmpleado.forEach((tarea) => {
        // Calcular altura máxima de la fila según contenido
        const values = [
          tarea.titulo || "",
          tarea.descripcion || "",
          formatearFecha(tarea.fecha_inicio),
          formatearFecha(tarea.fecha_finalizacion),
          tarea.hora_inicio || "",
          tarea.hora_finalizacion || "",
          getEstadoTarea(tarea),
          "", // Placeholder for trash icon
        ];

        const heights = values.map((value, i) => {
          if (i === 7) return 20; // icono fijo
          return doc.heightOfString(String(value), {
            width: colWidths[i] - 8,
            align: "left",
            font: "Helvetica",
            size: 10,
          });
        });
        const rowHeight = Math.max(...heights, 20);
        const pageHeight = doc.page.height - doc.page.margins.top - doc.page.margins.bottom;

        // Salto de página si no cabe la fila completa
        if (y + rowHeight > pageHeight) {
        doc.addPage();
        y = doc.page.margins.top;

          // Repite encabezado de empleado
          doc
            .font("Helvetica-Bold")
            .fontSize(12)
            .fillColor("#6b8e23")
            .text(`Empleado ID: ${empleadoId} - ${nombreCompleto}`, 30, y);
          y += 18;

          drawTableHeader();

          doc.font("Helvetica").fontSize(10);
        }

        // Dibuja la fila
        let x = 30;
        values.forEach((value, i) => {
          doc.rect(x, y, colWidths[i], rowHeight).stroke(borderColor);

          if (i === 7) {
            try {
              doc.image("trash.png", x + 8, y + 4, { width: 12, height: 12 });
            } catch (e) {
              // Ignorar error si no existe la imagen
            }
          } else {
            doc
              .fillColor(rowText)
              .font("Helvetica")
              .fontSize(10)
              .text(String(value), x + 4, y + 5, {
                width: colWidths[i] - 8,
                align: "left",
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

module.exports = { generateTareasPDF };