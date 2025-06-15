const db = require("../config/db");

const selectAll = async (page = 1, limit = 10, search = "") => {
  const offset = (page - 1) * limit;
  const term = `%${search}%`;

  /* 1) datos paginados */
  const [rows] = await db.query(
    `SELECT id, nombre, alergenos, categoria, cantidad, unidad,
            proveedor, estado,
            created_at AS createdAt,
            updated_at AS updatedAt
       FROM ingredientes
      WHERE CONCAT_WS(' ', nombre, alergenos, categoria, cantidad,
                           unidad, proveedor, estado) LIKE ?
      ORDER BY nombre
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

const insert = async ({ nombre, alergeno }) => {
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
