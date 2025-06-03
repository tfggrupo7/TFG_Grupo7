const db = require("../config/db");

const selectAll = async (page, limit) => {
  const [result] = await db.query("select * from empleados limit ? offset ?", [
    limit,
    (page - 1) * limit,
  ]);
  return result;
};

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
  { nombre, email, telefono, rol_id, usuario_id, salario,status,activo, fecha_inicio }
) => {
  const [result] = await db.query(
    "update empleados set nombre = ?, pass = ?, email = ?, telefono = ? , rol_id= ? , usuario_id = ? , salario = ?, status = ?, activo = ?, fecha_inicio = ? where id = ?",
    [nombre, email, telefono, rol_id, usuario_id, salario,status,activo, fecha_inicio,empleadoId]
  );
  return result;
};

const remove = async (empleadoId) => {
  const [result] = await db.query("delete from empleados where id = ?", [
    empleadoId,
  ]);
  return result;
};

const empleadoYrole = async (empleadoId) => {
  const [result] = await db.query(
    "select e.*, r.nombre as rol from empleados e join roles r on e.rol_id = r.id where e.id = ?",
    [empleadoId]
  );
  return result[0];
};

module.exports = {
  selectAll,
  selectById,
  selectByEmpleadoId,
  selectByTareaId,
  insert,
  update,
  remove,
  empleadoYrole
};
