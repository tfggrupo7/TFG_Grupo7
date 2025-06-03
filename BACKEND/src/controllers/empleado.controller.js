const Empleado = require("../models/empleados.model");
const Tarea = require("../models/tareas.model");
const Role = require("../models/rol.model");

// Autor Controller
const getAll = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const empleado = await Empleado.selectAll();
    res.json(
    
    empleado
  );
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

const getEmpleadosYRoles = async (req, res) => {
  try {
    // 1. Obtener todos los empleados
    const empleados = await Empleado.selectAll();

    // 2. Para cada empleado, obtener su rol y añadirlo al objeto empleado
    const empleadosConRol = await Promise.all(
      empleados.map(async (empleado) => {
        const role = await Role.selectById(empleado.rol_id);
        return {
          ...empleado,
          role: role
        };
      })
    );

    // 3. Devolver el array de empleados con su rol
    res.json(empleadosConRol);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener empleados y roles", error });
  }
};

/*const getEmpleadoYrole = async (req, res) => {
  const { empleadoId } = req.params;
  const empleado = await Empleado.selectById(empleadoId);
  if (!empleado) {
    return res.status(404).json({ message: "Empleado no encontrado" });
  }
  const role = await Role.selectById(empleado.rol_id);
  empleado.role = role;
  res.json(empleado);
};*/

module.exports = { getAll, getById, create, getEmpleadosAndTarea, update, remove, getEmpleadosYRoles };
