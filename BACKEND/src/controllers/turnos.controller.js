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

const Turno = require('../models/turnos.model'); // DAO que encapsula las consultas MySQL

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
  res.json({ page: Number(page), limit: Number(limit), total: data.length, data });
};

/**
 * GET /api/turnos/:turnoId
 * --------------------------------------------------
 * Devuelve un único turno según su ID primario.
 * Si el ID no existe, el caller recibirá null/undefined.
 */
const getById = async (req, res) => {
  const { turnoId } = req.params;               // id numérico recibido en la ruta
  const turno = await Turno.selectById(turnoId); // consulta directa en BD
  if (!turno) {
    return res.status(404).json({ error: 'Turno no encontrado' });
  }
  res.json(turno);
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
  const { fecha } = req.params;                 // YYYY-MM-DD
  const turnos = await Turno.selectByDate(fecha);
  return res.json(turnos);                      // 200 OK
};

/**
 * POST /api/turnos
 * --------------------------------------------------
 * Crea un nuevo turno. Los campos admitidos deben coincidir con la interfaz ITurnos del front.
 */
const create = async (req, res) => {
  // Desestructuramos únicamente los campos esperados para evitar datos basura
  const {dia, hora, duracion, titulo, empleado_id, roles_id, fecha, estado, hora_inicio, hora_fin, color} = req.body;

  // Insert devolviendo insertId; TODO: manejar errores/validaciones desde middleware
  const result = await Turno.insert({dia,hora,duracion,titulo,empleado_id,roles_id,fecha,estado,hora_inicio,hora_fin,color});

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
  const { dia, hora, duracion, titulo, empleado_id, roles_id, fecha, estado, hora_inicio, hora_fin, color } = req.body;

  // Persistencia; el modelo discrimina si el id existe o no.
  await Turno.update(turnoId, {dia,hora,duracion,titulo,empleado_id,roles_id,fecha,estado,hora_inicio,hora_fin,color});

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



// Exportamos todas las acciones del controlador
module.exports = { getAll, getById, create, update, remove, getByDate };
