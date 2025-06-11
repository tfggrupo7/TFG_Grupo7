// BACKEND/src/controllers/turnos.controller.js
const Turno = require('../models/turnos.model');

const getAll = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const data = await Turno.selectAll(Number(page), Number(limit));
  res.json({ page: Number(page), limit: Number(limit), total: data.length, data });
};

const getById = async (req, res) => {
  const { turnoId } = req.params;
  const turno = await Turno.selectById(turnoId);
  res.json(turno);
};

const create = async (req, res) => {
  const { empleado_id, roles, fecha, hora_inicio, hora_fin, estado } = req.body;
  const result = await Turno.insert({ empleado_id, roles, fecha, hora_inicio, hora_fin, estado });
  const turno = await Turno.selectById(result.insertId);
  res.json(turno);
};

const update = async (req, res) => {
  const { turnoId } = req.params;
  const { empleado_id, roles, fecha, hora_inicio, hora_fin, estado } = req.body;
  await Turno.update(turnoId, { empleado_id, roles, fecha, hora_inicio, hora_fin, estado });
  const turno = await Turno.selectById(turnoId);
  res.json(turno);
};

const remove = async (req, res) => {
  const { turnoId } = req.params;
  await Turno.remove(turnoId);
  const turnos = await Turno.selectAll(1, 1000);
  res.json({ message: "turno eliminado", data: turnos });
};

module.exports = { getAll, getById, create, update, remove };
