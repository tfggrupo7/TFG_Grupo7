const Inventario = require("../models/inventario.model");

const getAll = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const inventario = await Inventario.selectAll(Number(page), Number(limit));
  res.json({
    page: Number(page),
    limit: Number(limit),
    total: inventario.length,
    data: inventario,
  });
};

const getById = async (req, res) => {
  const { inventarioId } = req.params;
  const inventario = await Inventario.selectById(inventarioId);

  res.json(inventario);
};

const create = async (req, res) => {
  const result = await Inventario.insert(req.body);
  const { ingrediente_id, cantidad, fecha_actualizacion } = req.body;
  const inventario = await Inventario.selectById(result.insertId);

  res.json(inventario);
};

const update = async (req, res) => {
  const { inventarioId } = req.params;
  const result = await Inventario.update(inventarioId, req.body);
  const { ingrediente_id, cantidad, fecha_actualizacion } = req.body;
  const inventario = await Inventario.selectById(inventarioId);

  res.json(inventario);
};

const remove = async (req, res) => {
  const { inventarioId } = req.params;
  const result = await Inventario.remove(inventarioId);
  const inventarios = await Inventario.selectAll(1, 1000);

  res.json({ message: "inventario eliminado", data: inventarios });
};
module.exports = { getAll, getById, create, update, remove };
