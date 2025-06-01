const db = require('../config/db');


const selectAll = async (page, limit) => {
  const [result] = await db.query("select * from pedidos limit ? offset ?", [
    limit,
    (page - 1) * limit,
  ]);
  return result;
};

const selectById = async (pedidoId) => {
  const [result] = await db.query("select * from pedidos where id = ?", [
    Number(pedidoId),
  ]);
  if (result.length === 0) {
    return null;
  }
  return result[0];
};
const insert = async ({ empleado_id, fecha, aprobado , aprobado_por}) => {
  const [result] = await db.query(
    "insert into pedidos (empleado_id, fecha, aprobado , aprobado_por ) values (?, ? ,?,?)",
    [empleado_id, fecha, aprobado , aprobado_por]
  );
  return result;
};

const update = async (pedidoId, { empleado_id, fecha, aprobado , aprobado_por }) => {
  const [result] = await db.query(
    "update pedidos set empleado_id = ?, fecha = ? , aprobado = ?, aprobado_por = ? where id = ?",
    [empleado_id, fecha, aprobado , aprobado_por, pedidoId]
  );
  return result;
};

const remove = async (pedidoId) => {
  const [result] = await db.query("delete from pedidos where id = ?", [
    pedidoId,
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