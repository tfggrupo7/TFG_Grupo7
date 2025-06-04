const Rol = require('../models/rol.model')

const getAll = async (req, res) => {
  const rol = await Rol.selectAll();
  res.json(rol);
};

const getById = async (req, res) => {
  const { rolId } = req.params;
  const rol = await Rol.selectById(rolId);
 
  res.json(rol);
  //res.json(req.rols);
};

const create = async (req, res) => {
  const result = await Rol.insert(req.body);
  const { nombre, descripcion } = req.body;
  const rol = await Rol.selectById(result.insertId);

  res.json(rol);
};

const update = async (req, res) => {
  const { rolId } = req.params;
  const result = await Rol.update(rolId, req.body);
  const { nombre, descripcion } = req.body;
  const rol = await Rol.selectById(rolId);

  res.json(rol);
};

const remove = async (req, res) => {
  const { rolId } = req.params;
  const result = await Rol.remove(rolId);
  const rols = await Rol.selectAll(1, 1000);

  res.json({ message: "rol eliminado", data: rols });
};
module.exports = { getAll , getById, create, update, remove };