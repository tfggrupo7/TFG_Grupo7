const db = require('../config/db');


const selectAll = async (page, limit) => {
  const [result] = await db.query("select * from ingredientes limit ? offset ?", [
    limit,
    (page - 1) * limit,
  ]);
  return result;
};

const selectById = async (ingredienteId) => {
  const [result] = await db.query("select * from ingredientes where id = ?", [
    Number(ingredienteId),
  ]);
  if (result.length === 0) {
    return null;
  }
  return result[0];
};
const insert = async ({ nombre, categoria, cantidad, proveedor, estado, ultima_actualizacion, acciones }) => {
  const [result] = await db.query(
    `insert into ingredientes (nombre, categoria, cantidad, proveedor, estado, ultima_actualizacion, acciones) values (?, ?, ?, ?, ?, ?, ?)`,
    [nombre, categoria, cantidad, proveedor, estado, ultima_actualizacion, acciones]
  );
  return result;
};

const update = async (ingredienteId, { nombre, categoria, cantidad, proveedor, estado, ultima_actualizacion, acciones }) => {
  const [result] = await db.query(
    `update ingredientes set nombre = ?, categoria = ?, cantidad = ?, proveedor = ?, estado = ?, ultima_actualizacion = ?, acciones = ? where id = ?`,
    [nombre, categoria, cantidad, proveedor, estado, ultima_actualizacion, acciones, ingredienteId]
  );
  return result;
};

const remove = async (ingredienteId) => {
  const [result] = await db.query("delete from ingredientes where id = ?", [
    ingredienteId,
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