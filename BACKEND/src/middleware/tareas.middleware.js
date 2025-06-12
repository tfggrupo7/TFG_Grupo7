const Tareas = require("../models/tareas.model");
const jwt = require("jsonwebtoken");

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
  const { titulo , descripcion, empleado_id, fecha_finalizacion, fecha_inicio, estado, hora_inicio, hora_finalizacion} = req.body;

  if (!titulo || !descripcion || !empleado_id || !fecha_finalizacion || !fecha_inicio || !estado || !hora_inicio || !hora_finalizacion) { 
    return res
      .status(400)
      .json({message: "titulo , descripcion, empleado_id, fecha_finalizacion, fecha_inicio, estado, hora_inicio, hora_finalizacion son obligatorios"});
  }

  next();
}
// Middleware de autenticación (ejemplo)
const auth = (req, res, next) => {
  let token = req.headers.authorization;
  console.log('Authorization header:', token);
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  console.log('TOKEN RECIBIDO:', token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('DECODED:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('JWT VERIFY ERROR:', err.message);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = { checktareaId, checkdataTarea, auth };