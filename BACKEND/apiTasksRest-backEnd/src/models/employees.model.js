const db = require("../config/db");

const selectAll = async (page, limit) => {
  const [result] = await db.query("select * from employees limit ? offset ?", [
    limit,
    (page - 1) * limit,
  ]);
  return result;
};

const selectById = async (employeeId) => {
  const [result] = await db.query("select * from employees where id = ?", [
    employeeId,
  ]);
  if (result.length === 0) {
    return null;
  }
  return result[0];
};
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

const insert = async ({ name, email, username, password, position }) => {
  const [result] = await db.query(
    "insert into employees (name, email, username, password, position) values (?, ?, ?, ?, ?)",
    [name, email, username, password, position]
  );
  return result;
};

const update = async (employeeId, { name, email, username, password, position }) => {
  const [result] = await db.query(
    "update employees set name = ?, email = ?, username = ?, password=?, position = ? where id = ?",
    [name, email, username, password, position, employeeId]
  );
  return result;
};

const remove = async (employeeId) => {
  const [result] = await db.query("delete from employees where id = ?", [
    employeeId,
  ]);
  return result;
};

module.exports = {
  selectAll,
  selectById,
  selectByEmployeeId,
  selectByTaskId,
  insert,
  update,
  remove,
};
