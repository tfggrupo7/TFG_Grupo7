const Employee = require("../models/employees.model");
const Task = require("../models/tasks.model");

// Autor Controller
const getAll = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const employee = await Employee.selectAll(Number(page), Number(limit));
  res.json({
    page: Number(page),
    limit: Number(limit),
    total: employee.length,
    data: employee,
  });
};

const getById = async (req, res) => {
  /*const { employeeId } = req.params;
  const autor = await Employee.selectById(employeeId);
 
  res.json(employee);*/
  res.json(req.employees);
};

const getEmployeesAndTask = async (req, res) => {
  const employees = await Employee.selectAll(1, 500);

  for (let employee of employees) {
    const tasks = await Task.selectByEmployeeId(employee.id);
    employee.tasks = tasks;
  }

  res.json(employees);
};

const create = async (req, res) => {
  const result = await Employee.insert(req.body);
  const { name, email, username, password, position } = req.body;
  const employee = await Employee.selectById(result.insertId);

  res.json(employee);
};

const update = async (req, res) => {
  const { employeeId } = req.params;
  const result = await Employee.update(employeeId, req.body);
  const { name, email, username, password, position } = req.body;
  const employee = await Employee.selectById(employeeId);

  res.json(employee);
};

const remove = async (req, res) => {
  const { employeeId } = req.params;
  const result = await Employee.remove(employeeId);
  const employees = await Employee.selectAll(1, 1000);

  res.json({ message: "Empleado eliminado", data: employees });
};

module.exports = { getAll, getById, create, getEmployeesAndTask, update, remove };
