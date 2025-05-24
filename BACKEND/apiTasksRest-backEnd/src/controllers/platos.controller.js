const Plato = require('../models/plato.model')

const getAll = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const plato = await Plato.selectAll(Number(page), Number(limit));
  res.json({
    page: Number(page),
    limit: Number(limit),
    total: plato.length,
    data: plato,
  });
};

const getById = async (req, res) => {
  const { platoId } = req.params;
  const plato = await Plato.selectById(platoId);
 
  res.json(plato);
  //res.json(req.platos);
};

const create = async (req, res) => {
  const result = await Plato.insert(req.body);
  const { nombre, descripcion } = req.body;
  const plato = await Plato.selectById(result.insertId);

  res.json(plato);
};

const update = async (req, res) => {
  const { platoId } = req.params;
  const result = await Plato.update(platoId, req.body);
  const { nombre, descripcion } = req.body;
  const plato = await Plato.selectById(platoId);

  res.json(plato);
};

const remove = async (req, res) => {
  const { platoId } = req.params;
  const result = await Plato.remove(platoId);
  const platos = await Plato.selectAll(1, 1000);

  res.json({ message: "plato eliminado", data: platos });
};
module.exports = { getAll , getById, create, update, remove };