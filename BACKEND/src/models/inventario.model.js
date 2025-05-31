const db = require('../config/db');


const selectAll = async (page, limit) => {
  const [result] = await db.query("select * from inventario limit ? offset ?", [
    limit,
    (page - 1) * limit,
  ]);
  return result;
};

const selectById = async (inventarioId) => {
  const [result] = await db.query("select * from inventario where id = ?", [
    Number(inventarioId),
  ]);
  if (result.length === 0) {
    return null;
  }
  return result[0];
};
const insert = async ({ ingrediente_id, cantidad, fecha_actualizacion}) => {
  const [result] = await db.query(
    "insert into inventario (ingrediente_id, cantidad, fecha_actualizacion ) values (?, ?, ?)",
    [ingrediente_id, cantidad, fecha_actualizacion]
  );
  return result;
};

const update = async (inventarioId, { ingrediente_id, cantidad, fecha_actualizacion}) => {
  const [result] = await db.query(
    "update inventario set ingrediente_id = ?, cantidad = ?, fecha_actualizacion = ? where id = ?",
    [ingrediente_id, cantidad, fecha_actualizacion, inventarioId]
  );
  return result;
};

const remove = async (inventarioId) => {
  const [result] = await db.query("delete from inventario where id = ?", [
    inventarioId,
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