/**
 * Modelo de acceso a datos para la tabla **turnos**.
 * --------------------------------------------------
 * Métodos expuestos:
 *   • selectAll(page, limit)
 *   • selectById(turnoId)
 *   • insert(payload)
 *   • update(turnoId, payload)
 *   • remove(turnoId)
 */
const db = require('../config/db'); // Pool/connection configurado en capa config

/**
 * Obtiene un listado paginado de turnos ordenados por fecha y hora de inicio.
 * @param {number} page  - Número de página (1‑based)
 * @param {number} limit - Registros por página
 * @returns {Promise<Array>} Array de filas
 */
const selectAll = async (page, limit) => {
  // OFFSET = (page‑1) * limit
  const [rows] = await db.query(
    "SELECT * FROM turnos ORDER BY fecha, hora_inicio LIMIT ? OFFSET ?",
    [limit, (page - 1) * limit]
  );
  return rows; // Array de objetos (vacío si no hay datos)
};


/**
 * Devuelve un turno por su clave primaria.
 * @param {number|string} turnoId - ID del turno
 * @returns {Promise<Object|null>} Fila encontrada o null si no existe
 */
const selectById = async (turnoId) => {
  const [rows] = await db.query(
    "SELECT * FROM turnos WHERE id = ?",
    [Number(turnoId)] // Cast explícito para evitar ambigüedad
  );
  return rows[0] || null;
};
const selectByEmpleadoId = async (empleadoId) => {
  const [rows] = await db.query(
    "SELECT * FROM turnos WHERE empleado_id = ? ORDER BY fecha, hora_inicio",
    [Number(empleadoId)] 
  );
  return rows; 
}

const selectTurnosByDateAndEmpleado = async (fecha, empleadoId) => {
  const [rows] = await db.query(
    "SELECT * FROM turnos WHERE fecha = ? AND empleado_id = ? ORDER BY hora_inicio",
    [fecha, Number(empleadoId)]
  );
  return rows; // Array de objetos (vacío si no hay datos)
}

/**
 * Devuelve un listado de turnos filtrados por fecha.
 * @param {string} date - Fecha en formato YYYY-MM-DD
 * @returns {Promise<Array>} Array de filas (vacío si no hay datos)
 */
const selectByDate = async (date) => {
  const [rows] = await db.query(
    "SELECT * FROM turnos WHERE fecha = ? ORDER BY hora_inicio",
    [date]
  );
  return rows; // Array de objetos (vacío si no hay datos)
}

/**
 * Inserta un nuevo turno.
 * @param {Object} payload - Campos del turno (ver interfaz ITurnos)
 * @returns {Promise<Object>} Resultado MySQL con insertId, etc.
 */
const insert = async ({dia,hora,duracion,titulo,empleado_id,fecha,estado,hora_inicio,hora_fin,color}) => {
  const [result] = await db.query(
    `INSERT INTO turnos
     (dia, hora, duracion, titulo, empleado_id, fecha, estado, hora_inicio, hora_fin, color)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [dia, hora, duracion, titulo, empleado_id, fecha, estado, hora_inicio, hora_fin, color]
  );
  return result;
};

/**
 * Actualiza un turno existente.
 * @param {number|string} turnoId - ID a actualizar
 * @param {Object} payload       - Campos a guardar
 * @returns {Promise<Object>} Resultado MySQL (affectedRows, …)
 */
const update = async (
  turnoId, {dia,hora,duracion,titulo,empleado_id,fecha,estado,hora_inicio,hora_fin,color}
) => {
  const [result] = await db.query(
    `UPDATE turnos SET
       dia = ?, hora = ?, duracion = ?, titulo = ?, empleado_id = ?, fecha = ?, estado = ?, hora_inicio = ?, hora_fin = ?, color = ?
     WHERE id = ?`,
    [dia, hora, duracion, titulo, empleado_id, fecha, estado, hora_inicio, hora_fin, color, turnoId]
  );
  return result; // { insertId, affectedRows, … }
};

/**
 * Elimina un turno de forma permanente.
 * @param {number|string} turnoId - ID del turno
 * @returns {Promise<Object>} Resultado MySQL (affectedRows, …)
 */
const remove = async (turnoId) => {
  const [result] = await db.query(
    "DELETE FROM turnos WHERE id = ?",
    [turnoId]
  );
  return result;
};

const selectAllTurnosRaw = async () => {
  const query = `
    SELECT 
      t.*,
      e.nombre as empleado_nombre,
      e.apellidos as empleado_apellidos
    FROM turnos t
    LEFT JOIN empleados e ON t.empleado_id = e.id
    ORDER BY t.empleado_id, t.fecha
  `;
  // Ejecuta la consulta según tu ORM/conexión DB
  return await db.query(query);
};

const selectAllTurnosAndEmpleadoRaw = async (empleadoId) => {
  const [result] = await db.query(
    `SELECT 
      turnos.id,               -- Agregado el id del turno
      turnos.dia, 
      turnos.hora_inicio,
      turnos.hora_fin,
      turnos.duracion, 
      turnos.fecha,
      turnos.estado, 
      turnos.empleado_id,
      empleados.nombre AS empleado_nombre,
      empleados.apellidos AS empleado_apellidos
    FROM turnos
    INNER JOIN empleados ON turnos.empleado_id = empleados.id
    WHERE turnos.empleado_id = ?`,
    [empleadoId]
  );
  return result;
};

// Exports
module.exports = { selectAll, selectById, selectByEmpleadoId,selectTurnosByDateAndEmpleado, insert, update, remove, selectByDate, selectAllTurnosAndEmpleadoRaw,selectAllTurnosRaw };
