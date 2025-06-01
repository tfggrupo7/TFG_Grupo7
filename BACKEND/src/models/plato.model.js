const db = require('../config/db');


const selectAll = async (page, limit) => {
  const [result] = await db.query("select * from platos limit ? offset ?", [
    limit,
    (page - 1) * limit,
  ]);
  return result;
};

const selectById = async (platoId) => {
  const [result] = await db.query("select * from platos where id = ?", [
    Number(platoId),
  ]);
  if (result.length === 0) {
    return null;
  }
  return result[0];
};
const insert = async ({ nombre, descripcion}) => {
  const [result] = await db.query(
    "insert into platos (nombre, descripcion ) values (?, ?)",
    [nombre, descripcion]
  );
  return result;
};

const update = async (platoId, { nombre, descripcion}) => {
  const [result] = await db.query(
    "update platos set nombre = ?, descripcion = ?  where id = ?",
    [nombre, descripcion, platoId]
  );
  return result;
};

const remove = async (platoId) => {
  const [result] = await db.query("delete from platos where id = ?", [
    platoId,
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