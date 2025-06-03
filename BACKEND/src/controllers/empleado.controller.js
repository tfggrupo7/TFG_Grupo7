const Empleado = require("../models/empleados.model");
const Tarea = require("../models/tareas.model");
const Role = require("../models/rol.model");

// Autor Controller
const getAll = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const empleado = await Empleado.selectAll(Number(page), Number(limit));
    res.json({
    page: Number(page),
    limit: Number(limit),
    total: empleado.length,
    data: empleado,
  });
};

const getById = async (req, res) => {
  /*const { empleadoId } = req.params;
  const empleado = await Empleado.selectById(empleadoId);
 
  res.json(empleado);*/
  res.json(req.empleados);
};

const getEmpleadosAndTarea = async (req, res) => {
  const empleados = await Empleado.selectAll(1, 500);

  for (const empleado of empleados) {
    const tareas = await Tarea.selectByEmpleadoId(empleado.id);
    empleado.tareas = tareas;
  }

  res.json(empleados);
};

const create = async (req, res) => {
  const result = await Empleado.insert(req.body);
  const { nombre, email, telefono, rol_id, salario, status, activo, fecha_inicio } = req.body;
  const empleado = await Empleado.selectById(result.insertId);

  res.json(empleado);
};

const update = async (req, res) => {
  const { empleadoId } = req.params;
  const result = await Empleado.update(empleadoId, req.body);
  const { nombre, email, telefono, rol_id, salario, status, activo, fecha_inicio } = req.body;
  const empleado = await Empleado.selectById(empleadoId);

  res.json(empleado);
};

const remove = async (req, res) => {
  const { empleadoId } = req.params;
  const result = await Empleado.remove(empleadoId);
  const empleados = await Empleado.selectAll(1, 1000);

  res.json({ message: "Empleado eliminado", data: empleados });
};

const getEmpleadoYrole = async (req, res) => {
  const { empleadoId } = req.params;
  const empleado = await Empleado.selectById(empleadoId);
  if (!empleado) {
    return res.status(404).json({ message: "Empleado no encontrado" });
  }
  const role = await Role.selectById(empleado.rol_id);
  empleado.role = role;
  res.json(empleado);
};

module.exports = { getAll, getById, create, getEmpleadosAndTarea, update, remove, getEmpleadoYrole };
