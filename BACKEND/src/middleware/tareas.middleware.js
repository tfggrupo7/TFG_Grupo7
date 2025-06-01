const Tareas = require("../models/tareas.model");

const checktareaId = async (req, res, next) => {
  const { tareaId } = req.params;

  if (isNaN(tareaId)) {
    return res.status(400).json({ message: "El id debe ser un número" });
  }

  const tareas = await Tareas.selectByTareaId(tareaId);
  if (!tareas) {
    return res.status(404).json({ message: "La tarea  no existe" });
  }

  req.tareas = tareas;

  next();
};

const checkdataTarea = (req, res, next) => {
  const { descripcion, empleado_id, menu_id , fecha} = req.body;

  if (!descripcion || !empleado_id || !menu_id || !fecha ) { 
    return res
      .status(400)
      .json({message: "descripcion, empleado_id, menu_id y la fecha son obligatorios"});
  }

  next();
}

module.exports = { checktareaId, checkdataTarea };