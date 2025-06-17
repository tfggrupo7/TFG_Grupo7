const db = require("../config/db");

const selectAll = async (page = 1, limit = 10, search = "", orderBy= "nombre", direction="") => {
  const offset = (page - 1) * limit;
  const term = `%${search}%`;
  orderBy = orderBy.replace(/['"`]/g, '');
  direction = direction.replace(/['"`]/g, '');
  /* 1) datos paginados */
  const [rows] = await db.query(
    `SELECT id, nombre, alergenos, categoria, cantidad, unidad,
            proveedor, estado,
            created_at AS createdAt,
            updated_at AS updatedAt
       FROM ingredientes
      WHERE CONCAT_WS(' ', nombre, alergenos, categoria, cantidad,
                           unidad, proveedor, estado) LIKE ?
      ORDER BY ${orderBy} ${direction}
      LIMIT ? OFFSET ?`,
    [term, limit, offset]
  );

  /* 2) total para la paginación */
  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total
       FROM ingredientes
      WHERE CONCAT_WS(' ', nombre, alergenos, categoria, cantidad,
                           unidad, proveedor, estado) LIKE ?`,
    [term]
  );

  return { rows, total };
};

const selectById = async (ingredienteId) => {
  const [result] = await db.query(
    `SELECT id, nombre, alergenos, categoria, cantidad, unidad,
            proveedor, estado,
            created_at AS createdAt,
            updated_at AS updatedAt
       FROM ingredientes
      WHERE id = ?`,
    [Number(ingredienteId)]
  );
  return result[0] ?? null;
};

const selectSummary = async () => {
  const [result] = await db.query(`SELECT
    COUNT(*) AS total_productos,
    SUM(CASE WHEN estado = 'Bajo stock' THEN 1 ELSE 0 END) AS productos_bajo_stock,
    COUNT(DISTINCT categoria) AS categorias,
    COUNT(DISTINCT proveedor) AS proveedores,
    MAX(updated_at) AS ultima_actualizacion,
    (
      SELECT categoria
      FROM ingredientes
      GROUP BY categoria
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) AS categoria_mas_usada
  FROM ingredientes`)
  if (result.length === 0) return null;

  return result[0];
}

const insert = async ({ nombre, categoria, cantidad, unidad, proveedor, estado, alergenos}) => {
  const [result] = await db.query(
    "insert into ingredientes (nombre, categoria, cantidad, unidad, proveedor, estado, alergenos) values (?, ?, ?, ?, ?, ?, ?)",
    [nombre, categoria, cantidad, unidad, proveedor, estado, alergenos]
  );
  return result;
};

const update = async (ingredienteId, { nombre, categoria, cantidad, unidad, proveedor, estado, alergenos}) => {
  const [result] = await db.query(
    "update ingredientes set nombre = ?, categoria = ?, cantidad = ?, unidad = ?, proveedor = ?, estado = ?, alergenos = ? where id = ?",
    [nombre, categoria, cantidad, unidad, proveedor, estado, alergenos, ingredienteId]
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
  selectSummary,
  insert,
  update,
  remove,
};
