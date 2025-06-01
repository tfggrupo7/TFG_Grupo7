const db = require('../config/db');

const selectAll = async () => {
  const [result] = await db.query(`SELECT pi.plato_id, p.nombre AS plato_nombre, pi.ingrediente_id, i.nombre AS ingrediente_nombre, pi.cantidad
FROM platos_ingredientes pi
JOIN platos p ON pi.plato_id = p.id
JOIN ingredientes i ON pi.ingrediente_id = i.id`);
    
  return result;
};

const insert = async ({ plato_id, ingrediente_id, cantidad } = {}) => {
    const [result] = await db.query(
    "insert into platos_ingredientes (plato_id, ingrediente_id, cantidad ) values (?, ?, ?)",
    [plato_id, ingrediente_id, cantidad]
  );
  return result;
};


module.exports = {
  selectAll,
  insert,
  
};