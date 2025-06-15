const Turnos = require("../models/turnos.model");

const checkTurnoId = async (req, res, next) => {
  const { turnoId } = req.params;

  if (isNaN(turnoId)) {
    return res.status(400).json({ message: "El id del turno debe ser un número" });
  }

  const turno = await Turnos.selectById(turnoId);
  if (!turno) {
    return res.status(404).json({ message: "El turno no existe" });
  }

  req.turno = turno;
  next();
};

const checkDataTurno = (req, res, next) => {
  const {
    dia,
    hora,
    duracion,
    titulo,
    empleado_id,
    roles_id,
    fecha,
    estado,
    hora_inicio,
    hora_fin,
    color
  } = req.body;

  if (
    !dia ||
    hora === undefined ||
    duracion === undefined ||
    !titulo ||
    !empleado_id ||
    !roles_id ||
    !fecha ||
    !estado ||
    !hora_inicio ||
    !hora_fin ||
    !color
  ) {
    return res.status(400).send(
      "Todos los campos (dia, hora, duracion, titulo, empleado_id, rol_id, fecha, estado, hora_inicio, hora_fin, color) son obligatorios"
    );
  }

  next();
};

module.exports = { checkTurnoId, checkDataTurno};