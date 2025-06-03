const Empleados = require("../models/empleados.model");

const checkempleadosId = async (req, res, next) => {
  const { empleadoId } = req.params;

  if (isNaN(empleadoId)) {
    return res.status(400).json({ message: "El id debe ser un número" });
  }

  const empleados = await Empleados.selectById(empleadoId);
  if (!empleados) {
    return res.status(404).json({ message: "El empleado no existe" });
  }

  req.empleados = empleados;

  next();
};

const checkdataEmpleado = (req, res, next) => {
  const { nombre, email, telefono, rol_id, salario,  activo, fecha_inicio } = req.body;

  if (!nombre || !email || !telefono || !rol_id || !salario || !activo || !fecha_inicio ) {
    return res
      .status(400)
      .send("El nombre, email ,telefono, rol_id, salario, activo y fecha_inicio son obligatorios");
  }

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res.status(400).send("El email no es válido");
  }
  next();
};

module.exports = { checkempleadosId, checkdataEmpleado };
