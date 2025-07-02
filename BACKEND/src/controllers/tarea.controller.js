const Tarea = require("../models/tareas.model");
const Empleado = require("../models/empleados.model");
const { generateTareasPDF } = require("../helper/pdf.helper");
const { sendTareasEmail } = require("../helper/email.helper");
const path = require("path");
const fs = require("node:fs");

const getTareasById = async (req, res) => {
  const { tareaId } = req.params;
  const tareas = await Tarea.selectByTareaId(tareaId);
  res.json(tareas);
};

const getAllTareas = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const tareas = await Tarea.selectAllTareas(Number(page), Number(limit));
  res.json({
    page: Number(page),
    limit: Number(limit),
    total: tareas.length,
    data: tareas,
  });
};

const getTareasAndEmpleado = async (req, res) => {
  const tareas = await Tarea.selectAllTareas(1, 500);

  for (const tarea of tareas) {
    const empleado = await Empleado.selectById(tarea.empleado_id);
    if (empleado) {
      tarea.empleado = {
        nombre: empleado.nombre,
        apellidos: empleado.apellidos,
        email: empleado.email,
        telefono: empleado.telefono,
        activo: empleado.activo,
      };
    } else {
      tarea.empleado = null;
    }
  }

  res.json(tarea);
};

const getTareasAndEmpleadoById = async (req, res) => {
  const { empleadoId } = req.params;
  const tareas = await Tarea.selectByEmpleadoId(empleadoId);
  const empleado = await Empleado.selectById(empleadoId);

  if (!tareas) {
    return res
      .status(404)
      .send("No se encontraron las tareas para este empleado");
  }

  for (const tarea of tareas) {
    tarea.empleado = {
      nombre: empleado.nombre,
      apellidos: empleado.apellidos,
      email: empleado.email,
      telefono: empleado.telefono,
      activo: empleado.activo,
    };
  }

  res.json(tareas);
};
const createTarea = async (req, res) => {
  const {
    descripcion,
    empleado_id,
    fecha_finalizacion,
    fecha_inicio,
    estado,
    titulo,
    hora_inicio,
    hora_finalizacion,
  } = req.body;
  const empleadoIdNum = Number(empleado_id);
  if (!empleado_id || isNaN(empleadoIdNum)) {
    return res.status(400).json({ error: "empleado_id inválido" });
  }
  const empleado = await Empleado.selectById(empleadoIdNum);
  if (!empleado) {
    return res.status(404).json({ error: "El usuario no existe" });
  }
  const result = await Tarea.insert(
    descripcion,
    empleadoIdNum,
    fecha_finalizacion,
    fecha_inicio,
    estado,
    titulo,
    hora_inicio,
    hora_finalizacion
  );
  const tarea = await Tarea.selectByTareaId(result.insertId);

  res.json(tarea);
};

const updateTarea = async (req, res) => {
  const { tareaId } = req.params;
  const result = await Tarea.update(tareaId, req.body);
  const {
    descripcion,
    empleado_id,
    fecha_finalizacion,
    fecha_inicio,
    estado,
    titulo,
    hora_inicio,
    hora_finalizacion,
  } = req.body;
  const tarea = await Tarea.selectByTareaId(tareaId);

  res.json(tarea);
};

const removeTarea = async (req, res) => {
  const { tareaId } = req.params;
  const result = await Tarea.remove(tareaId);
  const tareas = await Tarea.selectAllTareas(1, 1000);

  res.json({ message: "Tarea eliminada ", data: tareas });
};

// tareas para el pdf
const getAllTareasRaw = async () => {
  return await Tarea.selectAllTareasRaw();
};

const exportTareasPDF = async (req, res) => {
  try {
    const tareas = await Tarea.selectAllTareasRaw();
    const pdfDir = path.join(__dirname, "pdfs");
    const filePath = path.join(pdfDir, "tareas.pdf");
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir);
    }
    // Generar el PDF

    await generateTareasPDF(tareas, filePath);

    res.download(filePath, "tareas.pdf", (err) => {
      if (err) {
        console.error("Error al enviar el PDF:", err);
      }
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error al borrar el PDF:", err);
      });
    });
  } catch (err) {
    console.error("Error al generar el PDF:", err);
    res
      .status(500)
      .json({ error: "Error al generar el PDF", details: err.message });
  }
};
// Generacion de pdf de tareas por empleado

const getAllTareasEmpleadoRaw = async (empleadoId) => {
  return await Tarea.selectAllTareasAndEmpleadoRaw(empleadoId);
};

const exportTareasEmpleadoPDF = async (req, res) => {
  const empleadoId = Number(req.params.empleadoId);

  if (isNaN(empleadoId)) {
    return res.status(400).json({ error: "ID de empleado inválido" });
  }

  try {
    const tareas = await Tarea.selectAllTareasAndEmpleadoRaw(
      Number(empleadoId)
    );

    if (!tareas || tareas.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron tareas para este empleado" });
    }

    const pdfDir = path.join(__dirname, "pdfs");
    const filePath = path.join(pdfDir, `tareas_emp_${empleadoId}.pdf`);

    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    console.log("Generando PDF en:", filePath);
    await generateTareasPDF(tareas, filePath);

    res.download(filePath, `empleado_${empleadoId}_tareas.pdf`, (err) => {
      if (err) {
        console.error("Error al enviar el PDF:", err);
        return res
          .status(500)
          .json({ error: "Error al enviar el archivo PDF" });
      }
      // Eliminar el archivo temporal luego de enviarlo
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error al borrar el archivo PDF:", err);
      });
    });
  } catch (err) {
    console.error("Error al generar el PDF:", err);
    res
      .status(500)
      .json({ error: "Error al generar el PDF", details: err.message });
  }
};

// Envio de todas las tareas por email
const sendTareaPDF = async (req, res) => {
  const email = req.user?.email || req.body.email;

  if (!email) return res.status(400).json({ error: "Email requerido" });

  try {
    const tareas = await Tarea.selectAllTareasRaw();

    const filePath = path.join(__dirname, "tareas.pdf");

    await generateTareasPDF(tareas, filePath);
    await sendTareasEmail(
      email,
      "Lista de Tareas",
      "Adjunto encontrarás el PDF con las tareas.",
      filePath
    );
    console.log("Email enviado a:", email);

    fs.unlinkSync(filePath);
    res.json({ message: "Email enviado correctamente" });
  } catch (err) {
    console.error("Error al enviar el email:", err);
    res.status(500).json({ error: "Error al enviar el email" });
  }
};
// Envio tareas por email de un empleado

const sendAllTareaEmpleadoPDF = async (req, res) => {
  const email = req.user?.email || req.body.email;
  const empleadoId = Number(req.params.empleadoId);

  if (!email) return res.status(400).json({ error: "Email requerido" });

  try {
    const tareas = await Tarea.selectAllTareasAndEmpleadoRaw(empleadoId);

    if (!tareas || tareas.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron tareas para este empleado" });
    }

    const filePath = path.join(__dirname, `tareas_emp_${empleadoId}.pdf`);

    await generateTareasPDF(tareas, filePath);

    await sendTareasEmail(
      email,
      "Lista de Tareas",
      "Adjunto encontrarás el PDF con las tareas.",
      filePath
    );

    fs.unlinkSync(filePath);

    res.json({ message: "Email enviado correctamente" });
  } catch (err) {
    console.error("Error al enviar el email:", err);
    res
      .status(500)
      .json({ error: "Error al enviar el email", details: err.message });
  }
};

module.exports = {
  getTareasById,
  getAllTareas,
  createTarea,
  updateTarea,
  removeTarea,
  getTareasAndEmpleado,
  getTareasAndEmpleadoById,
  getAllTareasRaw,
  exportTareasPDF,
  sendTareaPDF,
  sendAllTareaEmpleadoPDF,
  getAllTareasEmpleadoRaw,
  exportTareasEmpleadoPDF,
};
