const db = require("../config/db");

const selectAll = async (page = 1, limit = 10, search = "", orderBy= "nombre", direction="", id, tipo) => {
  const offset = (page - 1) * limit;
  const term = `%${search}%`;
  orderBy = orderBy.replace(/['"`]/g, '');
  direction = direction.replace(/['"`]/g, '');
  let condicion = '';
  if(tipo==='empleado'){
    condicion = '(i.empleados_id = ? OR i.usuario_id = (SELECT usuario_id from empleados where id=?))'
  } else {
    condicion = '(i.usuario_id = ? OR i.empleados_id IN (SELECT id FROM empleados WHERE usuario_id = ?))'
  }
  /* 1) datos paginados */
  const [rows] = await db.query(
    `SELECT DISTINCT i.id, i.nombre, i.alergenos, i.categoria, i.cantidad, i.unidad,
            i.proveedor, i.estado,
            i.created_at AS createdAt,
            i.updated_at AS updatedAt
      FROM ingredientes i
      WHERE  ${condicion}
      AND CONCAT_WS(' ', i.nombre, i.alergenos, i.categoria, i.cantidad, i.unidad, i.proveedor, i.estado) LIKE ?
      ORDER BY ${orderBy} ${direction}
      LIMIT ? OFFSET ?`,
    [id, id, term, limit, offset]
  );

    /* 2) total para la paginación */
  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total
    FROM ingredientes i
    WHERE ${condicion}
    AND CONCAT_WS(' ', i.nombre, i.alergenos, i.categoria, i.cantidad, i.unidad, i.proveedor, i.estado) LIKE ?`,
    [id, id,term]
  );

  return { rows, total };
};

const selectIngredientesConProblemasDeStock = async () => {
  try {
    const [result] = await db.query(`
      SELECT * FROM ingredientes 
      WHERE estado IN ('Bajo stock', 'Sin stock')
    `);
    return result || [];
  } catch (error) {
    console.error("Error al obtener ingredientes con problemas de stock:", error);
    throw new Error("Error al consultar ingredientes filtrados");
  }
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

const selectSummary = async (tipo, id) => {
  let condicion = '';
  if(tipo==='empleado'){
    condicion = 'empleados_id = ? OR usuario_id = (SELECT usuario_id from empleados where id=?)'
  } else {
    condicion = 'usuario_id = ? OR empleados_id in (SELECT id from empleados where usuario_id=?)'
  }
  const [result] = await db.query(`SELECT 
    COUNT(*) AS total_productos,
    SUM(CASE WHEN estado = 'Bajo stock' THEN 1 ELSE 0 END) AS productos_bajo_stock,
    COUNT(DISTINCT categoria) AS categorias,
    COUNT(DISTINCT proveedor) AS proveedores,
    MAX(updated_at) AS ultima_actualizacion,
    (
        SELECT categoria
        FROM ingredientes
        WHERE ${condicion}            
        GROUP BY categoria
        ORDER BY COUNT(*) DESC
        LIMIT 1
    ) AS categoria_mas_usada
    FROM ingredientes
    WHERE ${condicion}`,
    [id,id,id,id])
  if (result.length === 0) return null;

  return result[0];
}

const insert = async ({ nombre, categoria, cantidad, unidad, proveedor, estado, alergenos, usuario_id, empleados_id}) => {
  const [result] = await db.query(
    "insert into ingredientes (nombre, categoria, cantidad, unidad, proveedor, estado, alergenos, usuario_id, empleados_id) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [nombre, categoria, cantidad, unidad, proveedor, estado, alergenos, usuario_id, empleados_id]
  );
  return result;
};

const update = async (ingredienteId, { nombre, categoria, cantidad, unidad, proveedor, estado, alergenos, usuario_id, empleados_id}) => {
  const [result] = await db.query(
    `update ingredientes set nombre = ?, categoria = ?, cantidad = ?, unidad = ?, proveedor = ?, estado = ?, alergenos = ?,
    usuario_id = ?, empleados_id = ? where id = ?`,
    [nombre, categoria, cantidad, unidad, proveedor, estado, alergenos, usuario_id, empleados_id, ingredienteId]
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
  selectIngredientesConProblemasDeStock,  
  selectById,
  selectSummary,
  insert,
  update,
  remove,
};
