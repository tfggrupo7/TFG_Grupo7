const db = require("../config/db");

const selectAll = async (page, limit) => {
  const [result] = await db.query("select * from empleados ");
  return result;
};
/*const selectAll = async (page, limit) => {
  const [result] = await db.query("select * from empleados limit ? offset ?", [
    limit,
    (page - 1) * limit,
  ]);
  return result;
};*/

const selectById = async (empleadoId) => {
  const [result] = await db.query("select * from empleados where id = ?", [
    Number(empleadoId),
  ]);
  if (result.length === 0) {
    return null;
  }
  return result[0];
};
const selectByEmpleadoId = async (empleadoId) => {
  const [result] = await db.query(
    "select * from tareas where empleado_id = ?",
    [Number(empleadoId)]
  );
  return result;
};
const selectByTareaId = async (tareaId) => {
  const [result] = await db.query("select * from tareas where id = ?", [
    tareaId,
  ]);
  return result;
};

const insert = async ({ nombre, email, telefono, rol_id, usuario_id, salario, status, activo, fecha_inicio }) => {
  const [result] = await db.query(
    "insert into empleados (nombre, email, telefono, rol_id, usuario_id, salario, status, activo, fecha_inicio ) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [nombre, email, telefono, rol_id, usuario_id, salario, status, activo, fecha_inicio]
  );
  return result;
};

const update = async (
  empleadoId,
  { nombre, email, telefono, rol_id, salario,status,activo, fecha_inicio }
) => {
  const [result] = await db.query(
    "update empleados set nombre = ?,  email = ?, telefono = ? , rol_id= ? , salario = ?, status = ?, activo = ?, fecha_inicio = ? where id = ?",
    [nombre, email, telefono, rol_id, salario,status,activo, fecha_inicio,empleadoId]
  );
  return result;
};

const remove = async (empleadoId) => {
  const [result] = await db.query("delete from empleados where id = ?", [
    empleadoId,
  ]);
  return result;
};

const empleadosYroles = async () => {
  let { limit, offset } = req.query;

// Convierte a número y pon valores por defecto si no están definidos
limit = Number(limit) || 10;    // Por ejemplo, 10 por defecto
offset = Number(offset) || 0;   // 0 por defecto

const [result] = await db.query(
  "SELECT e.*, r.nombre AS rol FROM empleados e JOIN roles r ON e.rol_id = r.id LIMIT ? OFFSET ?",
  [limit, offset]
);
};

module.exports = {
  selectAll,
  selectById,
  selectByEmpleadoId,
  selectByTareaId,
  insert,
  update,
  remove,
  empleadosYroles
};
