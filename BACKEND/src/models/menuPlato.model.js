const db = require('../config/db');

const selectAll = async () => {
  const [result] = await db.query(`SELECT mp.menu_id, m.nombre AS menu_nombre, mp.plato_id, p.nombre AS plato_nombre
FROM menus_platos mp
JOIN menus m ON mp.menu_id = m.id
JOIN platos p ON mp.plato_id = p.id`);
    
  return result;
};

const insert = async ({ menu_id, plato_id } = {}) => {
  if (menu_id === undefined || plato_id === undefined) {
    throw new Error("menu_id y plato_id son requeridos");
  }
  const [result] = await db.query(
    "insert into menus_platos (menu_id, plato_id ) values (?, ?)",
    [menu_id, plato_id]
  );
  return result;
};

const remove = async ({ menu_id, plato_id }) => {
  await db.query(
    "DELETE FROM menus_platos WHERE menu_id = ? AND plato_id = ? ",
    [menu_id, plato_id]
  );
};

module.exports = {
  selectAll,
  insert,
  remove
};