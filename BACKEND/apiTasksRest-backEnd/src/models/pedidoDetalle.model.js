const db = require('../config/db');

const selectAll = async () => {
  const [result] = await db.query(`SELECT pd.pedido_id, pe.fecha, pd.ingrediente_id, i.nombre AS ingrediente_nombre, pd.cantidad
FROM Pedidos_Detalle pd
JOIN Pedidos pe ON pd.pedido_id = pe.id
JOIN Ingredientes i ON pd.ingrediente_id = i.id`);
    
  return result;
};

const insert = async ({ pedido_id, ingrediente_id, cantidad } = {}) => {
  
  const [result] = await db.query(
    "insert into pedidos_detalle (pedido_id, ingrediente_id, cantidad ) values (?, ?, ?)",
    [pedido_id, ingrediente_id, cantidad]
  );
  return result;
};


const remove = async ({ pedido_id, ingrediente_id }) => {
  await db.query(
    "DELETE FROM pedidos_detalle WHERE pedido_id = ? AND ingrediente_id = ?",
    [pedido_id, ingrediente_id]
  );
};

module.exports = {
  selectAll,
  insert,
 remove
};