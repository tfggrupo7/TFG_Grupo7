const Tasks = require("../models/tasks.model");

const checktaskId = async (req, res, next) => {
  const { taskId } = req.params;

  if (isNaN(taskId)) {
    return res.status(400).json({ message: "El id debe ser un número" });
  }

  const tasks = await Tasks.selectById(taskId);
  if (!tasks) {
    return res.status(404).json({ message: "La tarea  no existe" });
  }

  req.tasks = tasks;

  next();
};

const checkdataTask = (req, res, next) => {
  const { title, description, status, due_date,employee_id} = req.body;

  if (!title || !description || !status || !due_date || !employee_id) { 
    return res
      .status(400)
      .send.json({message: "El titulo, descripcion, status, fecha_vencimiento y el empleado_id son obligatorios"});
  }

  next();
}

module.exports = { checktaskId, checkdataTask };