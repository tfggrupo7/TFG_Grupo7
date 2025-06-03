const db = require('../config/db');


const selectAll = async (page, limit) => {
  const [result] = await db.query("select * from roles")
    
  return result;
};

const selectById = async (rolId) => {
  const [result] = await db.query("select * from roles where id = ?", [
    Number(rolId),
  ]);
  if (result.length === 0) {
    return null;
  }
  return result[0];
};
const insert = async ({ nombre }) => {
  const [result] = await db.query(
    "insert into roles (nombre ) values (?)",
    [nombre]
  );
  return result;
};

const update = async (rolId, { nombre }) => {
  const [result] = await db.query(
    "update roles set nombre = ? where id = ?",
    [nombre, rolId]
  );
  return result;
};

const remove = async (rolId) => {
  const [result] = await db.query("delete from roles where id = ?", [
    rolId,
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