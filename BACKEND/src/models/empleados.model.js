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

const insert = async ({ nombre, pass, email, telefono, rol_id, usuario_id }) => {
  const [result] = await db.query(
    "insert into empleados (nombre, pass, email, telefono, rol_id, usuario_id ) values (?, ?, ?, ?, ?, ?)",
    [nombre, pass, email, telefono, rol_id], usuario_id
  );
  return result;
};

const update = async (
  empleadoId,
  { nombre, pass, email, telefono, rol_id, usuario_id }
) => {
  const [result] = await db.query(
    "update empleados set nombre = ?, pass = ?, email = ?, telefono = ? , rol_id= ? , usuario_id = ? where id = ?",
    [nombre, pass, email, telefono, rol_id, usuario_id,empleadoId]
  );
  return result;
};

const remove = async (empleadoId) => {
  const [result] = await db.query("delete from empleados where id = ?", [
    empleadoId,
  ]);
  return result;
};

module.exports = {
  selectAll,
  selectById,
  selectByEmpleadoId,
  selectByTareaId,
  insert,
  update,
  remove,
};
