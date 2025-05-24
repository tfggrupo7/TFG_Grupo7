const db = require("../config/db");

const selectByEmpleadoId = async (empleadoId) => {
  const [result] = await db.query("select * from tareas where empleado_id = ?", [
    empleadoId,
  ]);
  return result;
};

const selectByTareaId = async (tareaId) => {
  const [result] = await db.query("select * from tareas where id = ?", [tareaId]);
  return result;
};

const selectAllTareas = async (page, limit) => {
  const [result] = await db.query(
    "select * from tareas order by id desc limit ? offset ?",
    [limit, (page - 1) * limit]
  );
  return result;
};

const selectAllTareasAndEmpleado = async (page, limit) => {
  const [result] = await db.query(
    "select tareas.*, empleados.nombre, empleados.pass,empleados.email, empleados.telefono from tareas inner join empleados on tasks.empleado_id = empleados.id order by tareas.id desc limit ? offset ?",
    [limit, (page - 1) * limit]
  );
  return result;
}

const insert = async (descripcion, empleado_id, menu_id, fecha) => {
  const [result] = await db.query(
    "insert into tareas (descripcion,empleado_id,menu_id,fecha) values (?, ?, ?, ?)",
    [descripcion,empleado_id,menu_id,fecha]
  );
  return result;
};

const update = async (tareaId, { descripcion,empleado_id,menu_id,fecha }) => {
  const [result] = await db.query(
    "update tareas set descripcion = ?, empleado_id = ?,menu_id = ?, fecha = ? where id = ?",
    [descripcion,empleado_id,menu_id,fecha, tareaId]
  );
  return result;
};

const remove = async (tareaId) => {
  const [result] = await db.query("delete from tareas where id = ?", [tareaId]);
  return result;
};

// Recoge todas las tareas sin paginacion y sin filtrar para generar el PDF
// y enviarlas por email

const selectAllTareasRaw = async () => {
  const [result] = await db.query("SELECT * FROM tareas");
  return result;
};

const selectAllTareasAndEmpleadoRaw = async (empleadoId) => {
  const [result] = await db.query(
    `SELECT tarea_id, tareas.descripcion, tareas.empleado_id, empleados.nombre as empleado_nombre
     FROM tareas
     INNER JOIN empleados ON tareas.empleados_id = empleados_id
     WHERE tareas.empleado_id = ?`,
    [empleadoId]
  );
  return result;
};


module.exports = {
  selectByEmpleadoId,
  selectByTareaId,
  selectAllTareas,
  selectAllTareasAndEmpleado,
  insert,
  update,
  remove,
  selectAllTareasRaw,
  selectAllTareasAndEmpleadoRaw,
};
