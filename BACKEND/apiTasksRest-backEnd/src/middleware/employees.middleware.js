const Employees = require("../models/employees.model");

const checkemployeesId = async (req, res, next) => {
  const { employeeId } = req.params;

  if (isNaN(employeeId)) {
    return res.status(400).json({ message: "El id debe ser un número" });
  }

  const employees = await Employees.selectById(employeeId);
  if (!employees) {
    return res.status(404).json({ message: "El empleado no existe" });
  }

  req.employees = employees;

  next();
};

const checkdataEmployee = (req, res, next) => {
  const { name, email, username, password, position } = req.body;

  if (!name || !email || !username || !password || !position) {
    return res
      .status(400)
      .send("El nombre, email, username, passsword y la posicion son obligatorios");
  }

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res.status(400).send("El email no es válido");
  }
  if (username.length < 3) {
    return res.status(400).send("El username debe tener al menos 3 caracteres");
  }
  if (password.length < 6) {
    return res.status(400).send("El password debe tener al menos 6 caracteres");
  }
  next();
};

module.exports = { checkemployeesId, checkdataEmployee };
