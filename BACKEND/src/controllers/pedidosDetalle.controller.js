const Pedido_detalle = require('../models/pedidoDetalle.model')

const getAll = async (req, res) => {
  const result = await Pedido_detalle.selectAll();
  
  res.json(result);
  
  };


const create = async (req, res) => {
const { pedido_id, ingrediente_id, cantidad } = req.body;
await Pedido_detalle.insert({pedido_id, ingrediente_id, cantidad})

res.json({
    pedido_id,
    ingrediente_id,
    cantidad
    
  });

};


const remove = async (req, res) => {
  const { pedido_id, ingrediente_id, cantidad } = req.body || {};
  if (!pedido_id || !ingrediente_id || !cantidad) {
    return res.status(400).json({ error: "pedido_id e ingrediente_id y cantidad son requeridos" });
  }
  await Pedido_detalle.remove({ pedido_id, ingrediente_id, cantidad });
  res.json({ message: "Detalle eliminado correctamente", pedido_id, ingrediente_id, cantidad });
};

module.exports = { getAll, create , remove }