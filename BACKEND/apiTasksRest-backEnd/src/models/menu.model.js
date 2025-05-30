const db = require('../config/db');


const selectAll = async (page, limit) => {
  const [result] = await db.query("select * from menus limit ? offset ?", [
    limit,
    (page - 1) * limit,
  ]);
  return result;
};

const selectById = async (menusId) => {
  const [result] = await db.query("select * from menus where id = ?", [
    Number(menusId),
  ]);
  if (result.length === 0) {
    return null;
  }
  return result[0];
};
const insert = async ({ nombre, descripcion}) => {
  const [result] = await db.query(
    "insert into menus (nombre, descripcion ) values (?, ?)",
    [nombre, descripcion]
  );
  return result;
};

const update = async (menusId, { nombre, descripcion}) => {
  const [result] = await db.query(
    "update menus set nombre = ?, descripcion = ?  where id = ?",
    [nombre, descripcion, menusId]
  );
  return result;
};

const remove = async (menusId) => {
  const [result] = await db.query("delete from menus where id = ?", [
    menusId,
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