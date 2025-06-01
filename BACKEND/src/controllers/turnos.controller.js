const Turno = require('../models/turno.model')

const getAll = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const turno = await Turno.selectAll(Number(page), Number(limit));
  res.json({
    page: Number(page),
    limit: Number(limit),
    total: turno.length,
    data: turno,
  });
};

const getById = async (req, res) => {
  const { turnoId } = req.params;
  const turno = await Turno.selectById(turnoId);
 
  res.json(turno);
  //res.json(req.turnos);
};

const create = async (req, res) => {
  const result = await Turno.insert(req.body);
  const { nombre } = req.body;
  const turno = await Turno.selectById(result.insertId);

  res.json(turno);
};

const update = async (req, res) => {
  const { turnoId } = req.params;
  const result = await Turno.update(turnoId, req.body);
  const { nombre } = req.body;
  const turno = await Turno.selectById(turnoId);

  res.json(turno);
};

const remove = async (req, res) => {
  const { turnoId } = req.params;
  const result = await Turno.remove(turnoId);
  const turnos = await Turno.selectAll(1, 1000);

  res.json({ message: "turno eliminado", data: turnos });
};
module.exports = { getAll , getById, create, update, remove };