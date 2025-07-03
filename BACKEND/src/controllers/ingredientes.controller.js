const Ingrediente = require("../models/ingrediente.model");

const AllIngredientes = async (req, res) => {
  const {tipo, id=""} = req.query;
  const ingredientes = await Ingrediente.selectIngredientesConProblemasDeStock(tipo, id);
  res.json(ingredientes);
};

const getAll = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    orderBy = "cantidad",
    direction = "",
    id = "",
    tipo = "",
  } = req.query;
  const { rows, total } = await Ingrediente.selectAll(
    Number(page),
    Number(limit),
    search,
    orderBy,
    direction,
    id,
    tipo
  );
  res.json({
    page: Number(page),
    limit: Number(limit),
    total,
    orderBy,
    data: rows,
  });
};

const getById = async (req, res) => {
  const { ingredienteId } = req.params;
  const ingrediente = await Ingrediente.selectById(ingredienteId);

  res.json(ingrediente);
};

const getSummary = async (req, res) => {
  const { id = "", tipo } = req.query;
  const summary = await Ingrediente.selectSummary(tipo, id);
  if (!summary) {
    return res.status(404).json({ message: "No hay datos de inventario" });
  }
  res.json(summary);
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

module.exports = {
  getAll,
  AllIngredientes,
  getById,
  getSummary,
  create,
  update,
  remove,
};
