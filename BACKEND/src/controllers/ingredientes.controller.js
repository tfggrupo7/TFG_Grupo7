const Ingrediente = require('../models/ingrediente.model')

const getAll = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const ingrediente = await Ingrediente.selectAll(Number(page), Number(limit));
  res.json({
    page: Number(page),
    limit: Number(limit),
    total: ingrediente.length,
    data: ingrediente,
  });
};

const getById = async (req, res) => {
  const { ingredienteId } = req.params;
  const ingrediente = await Ingrediente.selectById(ingredienteId);
 
  res.json(ingrediente);
  //res.json(req.ingredientes);
};

const create = async (req, res) => {
  const result = await Ingrediente.insert(req.body);
  const ingrediente = await Ingrediente.selectById(result.insertId);

  res.json(ingrediente);
};

const update = async (req, res) => {
  const { ingredienteId } = req.params;
  const result = await Ingrediente.update(ingredienteId, req.body);
  const ingrediente = await Ingrediente.selectById(ingredienteId);

  res.json(ingrediente);
};

const remove = async (req, res) => {
  const { ingredienteId } = req.params;
  const result = await Ingrediente.remove(ingredienteId);
  const ingredientes = await Ingrediente.selectAll(1, 1000);

  res.json({ message: "Ingrediente eliminado", data: ingredientes });
};

module.exports = { getAll , getById, create, update, remove };