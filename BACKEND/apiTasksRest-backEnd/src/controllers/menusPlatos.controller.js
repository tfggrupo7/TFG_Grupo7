const Menu_Plato = require('../models/menuPlato.model')

const getAll = async (req, res) => {
  const result = await Menu_Plato.selectAll();
  
  res.json(result);
  
  };


const create = async (req, res) => {
const { menu_id, plato_id } = req.body;
await Menu_Plato.insert({menu_id, plato_id})

res.json({
    menu_id,
    plato_id,
    
  });
};

const remove = async (req, res) => {
  const { menu_id, plato_id } = req.body || {};
  if (!menu_id || !plato_id) {
    return res.status(400).json({ error: "pedido_id e ingrediente_id y cantidad son requeridos" });
  }

  await Menu_Plato.remove({ menu_id, plato_id });
  res.json({ message: "Menu eliminado correctamente", menu_id, plato_id });
};

module.exports = { getAll, create , remove }