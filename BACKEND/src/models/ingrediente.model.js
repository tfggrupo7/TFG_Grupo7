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
const insert = async ({ nombre, alergeno}) => {
  const [result] = await db.query(
    "insert into ingredientes (nombre,alergeno ) values (?, ?)",
    [nombre, alergeno]
  );
  return result;
};

const update = async (ingredienteId, { nombre, alergeno }) => {
  const [result] = await db.query(
    "update ingredientes set nombre = ?, alergeno = ? where id = ?",
    [nombre, alergeno, ingredienteId]
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