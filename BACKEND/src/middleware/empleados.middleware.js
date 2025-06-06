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

const checkdataEmpleadoUpdate = (req, res, next) => {
  const { nombre, email, apellidos} = req.body;

  if (!nombre || !email || !apellidos) {
    return res
      .status(400)
      .send("El nombre, email ,telefono, rol_id, salario, activo y fecha_inicio son obligatorios");
  }

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res.status(400).send("El email no es válido");
  }
  next();
};

const checkEmpleadoId = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ message: "No tienes autorizacion"});
  }
  
  const token = req.headers.authorization;
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(403).json({ message: "Token invalido" });
  }
  
  const empleado = await Empleado.selectById(payload.empleado_id);
  if(!empleado) {
    return res.status(403).json({ message: 'Empleado no existe'});
  }
  req.Emp = empleado;

  next();
};

module.exports = { checkempleadosId, checkdataEmpleado, checkdataEmpleadoUpdate, checkEmpleadoId };
