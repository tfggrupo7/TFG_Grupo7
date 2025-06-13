const db = require("../config/db");

const selectByEmpleadoId = async (empleadoId) => {
  const [result] = await db.query(
    "select * from tareas where empleado_id = ?",
    [empleadoId]
  );
  return result;
};

const selectByTareaId = async (tareaId) => {
  const [result] = await db.query("select * from tareas where id = ?", [
    tareaId,
  ]);
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
    "select tareas.*, empleado.nombre, empleado.email, empleado.telefono, activo, apellidos from tareas inner join empleados on tareas.empleado_id = empleados.id order by tareas.id desc limit ? offset ?",
    [limit, (page - 1) * limit]
  );
  return result;
};

const insert = async (
  descripcion,
  empleado_id,
  fecha_finalizacion,
  fecha_inicio,
  estado,
  titulo,
  hora_inicio,
  hora_finalizacion
) => {
  const [result] = await db.query(
    "insert into tareas (descripcion,empleado_id,fecha_finalizacion,fecha_inicio,estado,titulo,hora_inicio,hora_finalizacion) values (?, ?, ?, ?,?,?,?,?)",
    [
      descripcion,
      empleado_id,
      fecha_finalizacion,
      fecha_inicio,
      estado,
      titulo,
      hora_inicio,
      hora_finalizacion,
    ]
  );

  return result;
};

const update = async (
  tareaId,
  {
    descripcion,
    empleado_id,
    fecha_finalizacion,
    fecha_inicio,
    estado,
    titulo,
    hora_inicio,
    hora_finalizacion,
  }
) => {
  const [result] = await db.query(
    "update tareas set descripcion = ?, empleado_id = ?,fecha_finalizacion =?, fehca_inicio=?, estado=?, titulo=?, hora_inicio=?, hora_finalizacion=? where id = ?",
    [
      descripcion,
      empleado_id,
      fecha_finalizacion,
      fecha_inicio,
      estado,
      titulo,
      hora_inicio,
      hora_finalizacion,
      tareaId,
    ]
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
    `SELECT 
  tareas.titulo, 
  tareas.descripcion, 
  tareas.hora_inicio, 
  tareas.hora_finalizacion,
  tareas.fecha_inicio,
  tareas.fecha_finalizacion, 
  tareas.estado,
  tareas.empleado_id, 
  empleados.nombre AS empleado_nombre
FROM tareas
INNER JOIN empleados ON tareas.empleado_id = empleados.id
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
