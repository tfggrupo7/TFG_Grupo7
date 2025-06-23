/**
 * Middleware de validación para la entidad **Turnos**
 * --------------------------------------------------
 * Este archivo expone dos middlewares reutilizables en las rutas de turnos:
 *
 *   • **checkTurnoId**   → Verifica que `:turnoId` sea numérico y exista en la BD.
 *                          Si la fila existe, la inyecta en `req.turno` para evitar
 *                          consultas redundantes en el controlador.
 *
 *   • **checkDataTurno** → Comprueba que en el cuerpo de la petición (POST/PUT) vengan
 *                          *todos* los campos obligatorios. Si falta alguno, responde 400.
 */
const Turnos = require("../models/turnos.model"); // Acceso a métodos DAO (selectById, etc.)
const jwt = require("jsonwebtoken");
/**
 * Verifica que el parámetro de ruta `turnoId` es un número válido y que existe en la base de datos.
 *
 * Secuencia:
 *   1. Comprueba que `turnoId` sea numérico.
 *   2. Consulta la BD con `Turnos.selectById(turnoId)`.
 *   3. Si no existe → 404.
 *   4. Si existe → guarda la fila en `req.turno` y llama a `next()`.
 */
const checkTurnoId = async (req, res, next) => {
  const { turnoId } = req.params;

  // Paso 1: Validación de tipo
  if (isNaN(turnoId)) {
    return res.status(400).json({ message: "El id del turno debe ser un número" });
  }

  // Paso 2: Consulta a BD
  const turno = await Turnos.selectById(turnoId);
  if (!turno) {
    // Paso 3: turno inexistente
    return res.status(404).json({ message: "El turno no existe" });
  }

  // Paso 4: turno válido → inyectamos en req para ahorrar otra consulta más adelante
  req.turno = turno;
  next(); // Pasamos al siguiente middleware/controlador
};

/**
 * Valida que el cuerpo de la petición contenga todos los campos obligatorios para crear/actualizar un turno.
 * Actualmente exige TODOS los campos (no permite parciales).
 *
 * Si falta alguno, responde 400 con un mensaje explicativo y *no* llama a `next()`.
 */
const checkDataTurno = (req, res, next) => {
  const {dia,hora,duracion,titulo,empleado_id,roles_id,fecha,estado,hora_inicio,hora_fin,color} = req.body;

  // Se comprueba cada campo; == undefined permite 0 como válido para hora/duracion
  if (!dia || hora === undefined || duracion === undefined || !titulo || !empleado_id || !roles_id || !fecha || !estado || !hora_inicio || !hora_fin || !color) {
    return res.status(400).send(
      "Todos los campos (dia, hora, duracion, titulo, empleado_id, rol_id, fecha, estado, hora_inicio, hora_fin, color) son obligatorios"
    );
  }

  // Si todo OK → delegamos al siguiente middleware/controlador
  next();
};
const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('JWT VERIFY ERROR:', err.message);
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

module.exports = { checkTurnoId, checkDataTurno, auth}; // Exportación agrupada para facilidad de importación
