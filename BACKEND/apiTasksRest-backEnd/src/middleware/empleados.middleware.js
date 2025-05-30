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
  const { nombre, pass, email, telefono } = req.body;

  if (!nombre || !pass || !email || !telefono ) {
    return res
      .status(400)
      .send("El nombre, pass, email y telefono son obligatorios");
  }

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res.status(400).send("El email no es válido");
  }
  if (pass.length < 6) {
    return res.status(400).send("El password debe tener al menos 6 caracteres");
  }
  next();
};

module.exports = { checkempleadosId, checkdataEmpleado };
