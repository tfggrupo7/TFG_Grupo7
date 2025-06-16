// BACKEND/src/models/turnos.model.js
const db = require('../config/db');

const selectAll = async (page, limit) => {
  const [rows] = await db.query(
    "SELECT * FROM turnos ORDER BY fecha, hora_inicio "
    
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

const insert = async ({
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
  color
}) => {
  const [result] = await db.query(
    `INSERT INTO turnos
     (dia, hora, duracion, titulo, empleado_id, roles_id, fecha, estado, hora_inicio, hora_fin, color)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [dia, hora, duracion, titulo, empleado_id, roles_id, fecha, estado, hora_inicio, hora_fin, color]
  );
  return result;
};

const update = async (
  turnoId,
  {
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
    color
  }
) => {
  const [result] = await db.query(
    `UPDATE turnos SET
       dia = ?, hora = ?, duracion = ?, titulo = ?, empleado_id = ?, roles_id = ?, fecha = ?, estado = ?, hora_inicio = ?, hora_fin = ?, color = ?
     WHERE id = ?`,
    [dia, hora, duracion, titulo, empleado_id, roles_id, fecha, estado, hora_inicio, hora_fin, color, turnoId]
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
