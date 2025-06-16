const Ingrediente = require("../models/ingrediente.model");

const getAll = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const { rows, total } = await Ingrediente.selectAll(
    Number(page),
    Number(limit),
    search
  );
  res.json({ page: Number(page), limit: Number(limit), total, data: rows });
};

const getById = async (req, res) => {
  const { ingredienteId } = req.params;
  const ingrediente = await Ingrediente.selectById(ingredienteId);

  res.json(ingrediente);
  //res.json(req.ingredientes);
};

const create = async (req, res) => {
  const result = await Ingrediente.insert(req.body);
  const { nombre, categoria, cantidad, unidad, proveedor, estado, alergenos } = req.body;
  const ingrediente = await Ingrediente.selectById(result.insertId);

  res.json(ingrediente);
};

const update = async (req, res) => {
  const { ingredienteId } = req.params;
  const result = await Ingrediente.update(ingredienteId, req.body);
  const { nombre, categoria, cantidad, unidad, proveedor, estado, alergenos } = req.body;
  const ingrediente = await Ingrediente.selectById(ingredienteId);

  res.json(ingrediente);
};

const remove = async (req, res) => {
  const { ingredienteId } = req.params;
  const result = await Ingrediente.remove(ingredienteId);
  const ingredientes = await Ingrediente.selectAll(1, 1000);

  res.json({ message: "Ingrediente eliminado", data: ingredientes });
};
module.exports = { getAll, getById, create, update, remove };
