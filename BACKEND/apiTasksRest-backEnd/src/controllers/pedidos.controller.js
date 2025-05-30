const Pedido = require('../models/pedido.model')

const getAll = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const pedido = await Pedido.selectAll(Number(page), Number(limit));
  res.json({
    page: Number(page),
    limit: Number(limit),
    total: pedido.length,
    data: pedido,
  });
};

const getById = async (req, res) => {
  const { pedidoId } = req.params;
  const pedido = await Pedido.selectById(pedidoId);
 
  res.json(pedido);
  //res.json(req.pedidos);
};

const create = async (req, res) => {
  const result = await Pedido.insert(req.body);
  const { nombre, descripcion } = req.body;
  const pedido = await Pedido.selectById(result.insertId);

  res.json(pedido);
};

const update = async (req, res) => {
  const { pedidoId } = req.params;
  const result = await Pedido.update(pedidoId, req.body);
  const { nombre, descripcion } = req.body;
  const pedido = await Pedido.selectById(pedidoId);

  res.json(pedido);
};

const remove = async (req, res) => {
  const { pedidoId } = req.params;
  const result = await Pedido.remove(pedidoId);
  const pedidos = await Pedido.selectAll(1, 1000);

  res.json({ message: "pedido eliminado", data: pedidos });
};
module.exports = { getAll , getById, create, update, remove };