// BACKEND/src/models/turnos.model.js
const db = require('../config/db');

const selectAll = async (page, limit) => {
  const [rows] = await db.query(
    "SELECT * FROM turnos ORDER BY fecha, hora_inicio LIMIT ? OFFSET ?",
    [limit, (page - 1) * limit]
  );
  return rows;
};

const selectById = async (turnoId) => {
  const [rows] = await db.query(
    "SELECT * FROM turnos WHERE id = ?",
    [Number(turnoId)]
  );
  return rows[0] || null;
};

const insert = async ({ empleado_id, roles, fecha, hora_inicio, hora_fin, estado }) => {
  const [result] = await db.query(
    `INSERT INTO turnos
     (empleado_id, roles, fecha, hora_inicio, hora_fin, estado)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [empleado_id, roles, fecha, hora_inicio, hora_fin, estado]
  );
  return result;
};

const update = async (turnoId, { empleado_id, roles, fecha, hora_inicio, hora_fin, estado }) => {
  const [result] = await db.query(
    `UPDATE turnos SET
       empleado_id = ?, roles = ?, fecha = ?, hora_inicio = ?, hora_fin = ?, estado = ?
     WHERE id = ?`,
    [empleado_id, roles, fecha, hora_inicio, hora_fin, estado, turnoId]
  );
  return result;
};

const remove = async (turnoId) => {
  const [result] = await db.query(
    "DELETE FROM turnos WHERE id = ?",
    [turnoId]
  );
  return result;
};

module.exports = { selectAll, selectById, insert, update, remove };
