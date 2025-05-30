const Menu = require('../models/menu.model')

const getAll = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const menu = await Menu.selectAll(Number(page), Number(limit));
  res.json({
    page: Number(page),
    limit: Number(limit),
    total: menu.length,
    data: menu,
  });
};

const getById = async (req, res) => {
  const { menuId } = req.params;
  const menu = await Menu.selectById(menuId);
 
  res.json(menu);
  //res.json(req.menus);
};

const create = async (req, res) => {
  const result = await Menu.insert(req.body);
  const { nombre, descripcion } = req.body;
  const menu = await Menu.selectById(result.insertId);

  res.json(menu);
};

const update = async (req, res) => {
  const { menuId } = req.params;
  const result = await Menu.update(menuId, req.body);
  const { nombre, descripcion } = req.body;
  const menu = await Menu.selectById(menuId);

  res.json(menu);
};

const remove = async (req, res) => {
  const { menuId } = req.params;
  const result = await Menu.remove(menuId);
  const menus = await Menu.selectAll(1, 1000);

  res.json({ message: "menu eliminado", data: menus });
};
module.exports = { getAll , getById, create, update, remove };