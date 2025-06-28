/**
 * Controlador REST de la entidad **Turnos**.
 * --------------------------------------------------
 * Gestiona las rutas HTTP:
 *   • GET    /api/turnos          → getAll
 *   • GET    /api/turnos/:turnoId → getById
 *   • POST   /api/turnos          → create
 *   • PUT    /api/turnos/:turnoId → update
 *   • DELETE /api/turnos/:turnoId → remove
 */

const Turno = require("../models/turnos.model"); // DAO que encapsula las consultas MySQL
const path = require("path");
const fs = require("node:fs");
const { generateTurnosPDF } = require("../helper/turnosPdf.helper");
const { sendTurnosEmail } = require("../helper/turnosEmail.helper");
/**
 * GET /api/turnos
 * --------------------------------------------------
 * Devuelve una lista paginada de turnos.
 * QueryString:
 *   • page  — nº de página (opcional, por defecto 1)
 *   • limit — tamaño de página (opcional, por defecto 10)
 *
 * Ejemplo de respuesta:
 * {
 *   "page": 1,
 *   "limit": 10,
 *   "total": 6,
 *   "data": [ ... ]
 * }
 */
const getAll = async (req, res) => {
  // Desestructuramos con valores por defecto para asegurar enteros válidos
  const { page = 1, limit = 10 } = req.query;

  // El modelo recibe números; convertimos de string a Number para evitar NaN
  const data = await Turno.selectAll(Number(page), Number(limit));

  // total se calcula sobre el array recibido (no sobre COUNT(*)).
  res.json({
    page: Number(page),
    limit: Number(limit),
    total: data.length,
    data,
  });
};

/**
 * GET /api/turnos/:turnoId
 * --------------------------------------------------
 * Devuelve un único turno según su ID primario.
 * Si el ID no existe, el caller recibirá null/undefined.
 */
const getById = async (req, res) => {
  const { turnoId } = req.params; // id numérico recibido en la ruta
  const turno = await Turno.selectById(turnoId); // consulta directa en BD
  if (!turno) {
    return res.status(404).json({ error: "Turno no encontrado" });
  }
  res.json(turno);
};
const getByEmpleadoId = async (req, res) => {
  const { empleadoId } = req.params; // id numérico recibido en la ruta
  const turnos = await Turno.selectByEmpleadoId(empleadoId); // consulta directa en BD
  if (!turnos || turnos.length === 0) {
    return res
      .status(404)
      .json({ error: "No se encontraron turnos para el empleado" });
  }
  res.json(turnos);
};
const getTurnosByDateAndEmpleado = async (req, res) => {
  const { fecha, empleadoId } = req.params; // YYYY-MM-DD y empleadoId
  const turnos = await Turno.selectTurnosByDateAndEmpleado(fecha, empleadoId);
  if (!turnos || turnos.length === 0) {
    return res.status(404).json({
      error: "No se encontraron turnos para la fecha y empleado especificados",
    });
  }
  res.json(turnos);
};

/**
 * GET /api/turnos/by-date
 * --------------------------------------------------
 * Devuelve una lista de turnos filtrados por fecha.
 * QueryString:
 *   • date — fecha en formato YYYY-MM-DD (obligatorio)
 *
 * Ejemplo de respuesta:
 * [
 *   { ...turno1 },
 *   { ...turno2 },
 *   ...
 * ]
 */
const getByDate = async (req, res) => {
  const { fecha } = req.params; // YYYY-MM-DD
  const turnos = await Turno.selectByDate(fecha);
  return res.json(turnos); // 200 OK
};

/**
 * GET /api/turnos/by-date?date=YYYY-MM-DD
 * --------------------------------------------------
 * Devuelve una lista de turnos filtrados por fecha (query param).
 */
const getByDateQuery = async (req, res) => {
  const { date } = req.query; // YYYY-MM-DD
  if (!date) {
    return res.status(400).json({ error: "Falta el parámetro 'date'" });
  }
  const turnos = await Turno.selectByDate(date);
  return res.json(turnos); // 200 OK
};

/**
 * POST /api/turnos
 * --------------------------------------------------
 * Crea un nuevo turno. Los campos admitidos deben coincidir con la interfaz ITurnos del front.
 */
const create = async (req, res) => {
  // Desestructuramos únicamente los campos esperados para evitar datos basura
  const {
    dia,
    hora,
    duracion,
    titulo,
    empleado_id,
    fecha,
    estado,
    hora_inicio,
    hora_fin,
    color,
  } = req.body;

  // Insert devolviendo insertId; TODO: manejar errores/validaciones desde middleware
  const result = await Turno.insert({
    dia,
    hora,
    duracion,
    titulo,
    empleado_id,
    fecha,
    estado,
    hora_inicio,
    hora_fin,
    color,
  });

  // Fetch para regresar el objeto completo (sección de optimización si el modelo devolviese directamente la fila)
  const turno = await Turno.selectById(result.insertId);
  res.json(turno);
};

/**
 * PUT /api/turnos/:turnoId
 * --------------------------------------------------
 * Actualiza un turno existente y devuelve la versión resultante.
 */
const update = async (req, res) => {
  const { turnoId } = req.params; // ID obtenido de la URL

  // Campos de actualización (mismo shape que create)
  const {
    dia,
    hora,
    duracion,
    titulo,
    empleado_id,
    roles_id,
    fecha,
    estado,
    hora_inicio,
    hora_fin,
    color,
  } = req.body;

  // Persistencia; el modelo discrimina si el id existe o no.
  await Turno.update(turnoId, {
    dia,
    hora,
    duracion,
    titulo,
    empleado_id,
    roles_id,
    fecha,
    estado,
    hora_inicio,
    hora_fin,
    color,
  });

  // Consulta inmediata para retornar la fila ya actualizada
  const turno = await Turno.selectById(turnoId);
  res.json(turno);
};

/**
 * DELETE /api/turnos/:turnoId
 * --------------------------------------------------
 * Elimina un turno y, para comodidad del front, devuelve la lista completa (page=1, limit=1000).
 */
const remove = async (req, res) => {
  const { turnoId } = req.params; // PK del turno a eliminar
  await Turno.remove(turnoId); // delete físico; TODO: considerar borrado lógico con estado "INACTIVO"

  // Respuesta optimizada: solo mensaje y ID eliminado
  res.json({ message: "turno eliminado", id: turnoId });
};
const exportTurnosPDF = async (req, res) => {
  try {
    const turnos = await Turno.selectAllTurnosRaw();

    // Verificar que turnos no sea undefined o null
    if (!turnos || !Array.isArray(turnos)) {
      return res.status(404).json({ error: "No se encontraron turnos" });
    }

    const pdfDir = path.join(__dirname, "pdfs");
    const filePath = path.join(pdfDir, "turnos.pdf");

    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir);
    }

    await generateTurnosPDF(turnos, filePath);

    res.download(filePath, "turnos.pdf", (err) => {
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

const exportTurnosEmpleadoPDF = async (req, res) => {
  const empleadoId = Number(req.params.empleadoId);

  if (isNaN(empleadoId)) {
    return res.status(400).json({ error: "ID de empleado inválido" });
  }

  try {
    const turnos = await Turno.selectAllTurnosAndEmpleadoRaw(
      Number(empleadoId)
    );

    if (!turnos || turnos.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron turnos para este empleado" });
    }

    const pdfDir = path.join(__dirname, "pdfsTurnos");
    const filePath = path.join(pdfDir, `turnos_emp_${empleadoId}.pdf`);

    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    await generateTurnosPDF(turnos, filePath);

    res.download(filePath, `empleado_${empleadoId}_turnos.pdf`, (err) => {
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
const sendTurnoPDF = async (req, res) => {
  const email = req.user?.email || req.body.email;

  if (!email) return res.status(400).json({ error: "Email requerido" });

  try {
    const turnos = await Turno.selectAllTurnosRaw();

    const filePath = path.join(__dirname, "turnos.pdf");

    await generateTurnosPDF(turnos, filePath);
    await sendTurnosEmail(
      email,
      "Turnos",
      "Adjunto encontrarás el PDF con los Turnos.",
      filePath
    );

    fs.unlinkSync(filePath);
    res.json({ message: "Email enviado correctamente" });
  } catch (err) {
    console.error("Error al enviar el email:", err);
    res.status(500).json({ error: "Error al enviar el email" });
  }
};
// Envio turnos por email de un empleado

const sendAllTurnoEmpleadoPDF = async (req, res) => {
  const email = req.user?.email || req.body.email;
  const empleadoId = Number(req.params.empleadoId);

  if (!email) return res.status(400).json({ error: "Email requerido" });

  try {
    const turnos = await Turno.selectAllTurnosAndEmpleadoRaw(empleadoId);

    if (!turnos || turnos.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron turnos para este empleado" });
    }

    const filePath = path.join(__dirname, `turnos_emp_${empleadoId}.pdf`);

    await generateTurnosPDF(turnos, filePath);

    await sendTurnosEmail(
      email,
      "Turnos",
      "Adjunto encontrarás el PDF con los Turnos.",
      filePath
    );

    console.log("Email enviado a:", email);

    fs.unlinkSync(filePath);

    res.json({ message: "Email enviado correctamente" });
  } catch (err) {
    console.error("Error al enviar el email:", err);
    res
      .status(500)
      .json({ error: "Error al enviar el email", details: err.message });
  }
};

// Exportamos todas las acciones del controlador
module.exports = {
  getAll,
  getById,
  getByEmpleadoId,
  getTurnosByDateAndEmpleado,
  create,
  update,
  remove,
  getByDate,
  getByDateQuery,
  exportTurnosPDF,
  exportTurnosEmpleadoPDF,
  sendAllTurnoEmpleadoPDF,
  sendTurnoPDF,
};
