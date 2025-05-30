const db = require('../config/db');


const selectAll = async (page, limit) => {
  const [result] = await db.query("select * from turnos limit ? offset ?", [
    limit,
    (page - 1) * limit,
  ]);
  return result;
};

const selectById = async (turnoId) => {
  const [result] = await db.query("select * from turnos where id = ?", [
    Number(turnoId),
  ]);
  if (result.length === 0) {
    return null;
  }
  return result[0];
};
const insert = async ({ empleado_id, fecha, hora_inicio, hora_fin}) => {
  const [result] = await db.query(
    "insert into turnos (empleado_id, fecha, hora_inicio, hora_fin ) values (?, ?, ?, ?)",
    [empleado_id, fecha, hora_inicio, hora_fin]
  );
  return result;
};

const update = async (turnoId, { empleado_id, fecha, hora_inicio, hora_fin}) => {
  const [result] = await db.query(
    "update turnos set empleado_id = ?, fecha = ? , hora_inicio = ? , hora_fin = ?  where id = ?",
    [empleado_id, fecha, hora_inicio, hora_fin, turnoId]
  );
  return result;
};

const remove = async (turnoId) => {
  const [result] = await db.query("delete from turnos where id = ?", [
    turnoId,
  ]);
  return result;
};

module.exports = {
  selectAll,
  selectById,
  insert,
  update,
  remove,
};