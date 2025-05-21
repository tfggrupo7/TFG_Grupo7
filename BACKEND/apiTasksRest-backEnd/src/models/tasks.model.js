const db = require("../config/db");

const selectByEmployeeId = async (employeeId) => {
  const [result] = await db.query("select * from tasks where employee_id = ?", [
    employeeId,
  ]);
  return result;
};

const selectByTaskId = async (taskId) => {
  const [result] = await db.query("select * from tasks where id = ?", [taskId]);
  return result;
};

const selectAllTasks = async (page, limit) => {
  const [result] = await db.query(
    "select * from tasks order by id desc limit ? offset ?",
    [limit, (page - 1) * limit]
  );
  return result;
};

const selectAllTasksAndEmployee = async (page, limit) => {
  const [result] = await db.query(
    "select tasks.*, employees.name, employees.email, employees.username, employees.password, employees.position from tasks inner join employees on tasks.employee_id = employees.id order by tasks.id desc limit ? offset ?",
    [limit, (page - 1) * limit]
  );
  return result;
}

const insert = async (title, description, status, due_date,employee_id) => {
  const [result] = await db.query(
    "insert into tasks (title, description, status, due_date, employee_id) values (?, ?, ?, ?, ?)",
    [title, description, status,due_date, employee_id]
  );
  return result;
};

const update = async (taskId, { title, description, status, due_date, employee_id }) => {
  const [result] = await db.query(
    "update tasks set title = ?, description = ?, status = ?,due_date = ?, employee_id = ? where id = ?",
    [title, description, status, due_date, employee_id, taskId]
  );
  return result;
};

const remove = async (taskId) => {
  const [result] = await db.query("delete from tasks where id = ?", [taskId]);
  return result;
};

// Recoge todas las tareas sin paginacion y sin filtrar para generar el PDF
// y enviarlas por email

const selectAllTasksRaw = async () => {
  const [result] = await db.query("SELECT * FROM tasks");
  return result;
};

const selectAllTasksAndEmployeeRaw = async (employeeId) => {
  const [result] = await db.query(
    `SELECT tasks.id, tasks.title, tasks.description, tasks.due_date, employees.name as employee_name
     FROM tasks
     INNER JOIN employees ON tasks.employee_id = employees.id
     WHERE tasks.employee_id = ?`,
    [employeeId]
  );
  return result;
};


module.exports = {
  selectByEmployeeId,
  selectByTaskId,
  selectAllTasks,
  selectAllTasksAndEmployee,
  insert,
  update,
  remove,
  selectAllTasksRaw,
  selectAllTasksAndEmployeeRaw,
};
