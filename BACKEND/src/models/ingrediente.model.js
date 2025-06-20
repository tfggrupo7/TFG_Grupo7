const db = require("../config/db");

const selectAll = async (page = 1, limit = 10, search = "", orderBy= "nombre", direction="", userId) => {
  const offset = (page - 1) * limit;
  const term = `%${search}%`;
  orderBy = orderBy.replace(/['"`]/g, '');
  direction = direction.replace(/['"`]/g, '');
  /* 1) datos paginados */
  const [rows] = await db.query(
    `SELECT DISTINCT i.id, i.nombre, i.alergenos, i.categoria, i.cantidad, i.unidad,
            i.proveedor, i.estado,
            i.created_at AS createdAt,
            i.updated_at AS updatedAt
      FROM ingredientes i
      LEFT JOIN empleados e ON i.empleado_id = e.id
      WHERE
        ( ? IN (SELECT id FROM usuarios) AND 
        (i.usuario_id = ? OR i.empleado_id IN (SELECT id FROM empleados WHERE usuario_id = ?)))
        OR
        ( ? IN (SELECT id FROM empleados) AND 
        (i.empleado_id = ? OR i.usuario_id = (SELECT usuario_id FROM empleados WHERE id = ?)))
      AND CONCAT_WS(' ', i.nombre, i.alergenos, i.categoria, i.cantidad, i.unidad, i.proveedor, i.estado) LIKE ?
      ORDER BY ${orderBy} ${direction}
      LIMIT ? OFFSET ?`,
    [userId, userId, userId, userId, userId, userId, term, limit, offset]
  );

  /* 2) total para la paginación */
  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total
    FROM ingredientes i
    LEFT JOIN empleados e ON i.empleado_id = e.id
    WHERE 
    (? IN (SELECT id FROM usuarios) AND 
      (i.usuario_id = ? OR i.empleado_id IN (SELECT id FROM empleados WHERE usuario_id = ?)))
    OR
    (? IN (SELECT id FROM empleados) AND 
      (i.empleado_id = ? OR i.usuario_id = (SELECT usuario_id FROM empleados WHERE id = ?)))
    AND
    CONCAT_WS(' ', i.nombre, i.alergenos, i.categoria, i.cantidad,
        i.unidad, i.proveedor, i.estado) LIKE ?`,
    [userId, userId, userId, userId, userId, userId, term]
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

const selectSummary = async (userId) => {
  const [result] = await db.query(`SELECT 
    COUNT(*) AS total_productos,
    SUM(CASE WHEN estado = 'Bajo stock' THEN 1 ELSE 0 END) AS productos_bajo_stock,
    COUNT(DISTINCT categoria) AS categorias,
    COUNT(DISTINCT proveedor) AS proveedores,
    MAX(updated_at) AS ultima_actualizacion,
    (
        SELECT categoria
        FROM ingredientes
        WHERE 
            (EXISTS (SELECT 1 FROM usuarios WHERE id = ?) AND
            (usuario_id = ? OR empleado_id IN (SELECT id FROM empleados WHERE usuario_id = ?))
            )
          OR
            (EXISTS (SELECT 1 FROM empleados WHERE id = ?) AND
             empleado_id = ? OR usuario_id = (SELECT usuario_id FROM empleados WHERE id = ?)))
        GROUP BY categoria
        ORDER BY COUNT(*) DESC
        LIMIT 1
    ) AS categoria_mas_usada
    FROM ingredientes i
    WHERE 
    (EXISTS (SELECT 1 FROM usuarios WHERE id = ?) AND
     (i.usuario_id = ? OR i.empleado_id IN (SELECT id FROM empleados WHERE usuario_id = ?)))
    OR
    (EXISTS (SELECT 1 FROM empleados WHERE id = ?) AND
     (i.empleado_id = ? OR i.usuario_id = (SELECT usuario_id FROM empleados WHERE id = ?)))`,
    [userId,userId,userId,userId,userId,userId, userId,userId,userId,userId,userId,userId])
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
