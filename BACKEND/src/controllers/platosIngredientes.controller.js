const Plato_ingrediente = require('../models/platoIngrediente.model')

const getAll = async (req, res) => {
  const result = await Plato_ingrediente.selectAll();
  
  res.json(result);
  
  };


const create = async (req, res) => {
const { plato_id, ingrediente_id, cantidad } = req.body;
await Plato_ingrediente.insert({plato_id, ingrediente_id, cantidad})

res.json({
    plato_id,
    ingrediente_id,
    cantidad
  });
};


module.exports = { getAll, create}