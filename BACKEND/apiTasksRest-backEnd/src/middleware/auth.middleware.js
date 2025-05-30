const jwt = require("jsonwebtoken");

const Usuario = require("../models/usuarios.model");

const checkToken = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res.status(403).json({ message: " No tienes autorizacion " });
  }
  
  const token = req.headers["authorization"];
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(403).json({ message: "Token invalido" });
  }
  
  const usuario = Usuario.getById(payload.usuario_id);
  if(!usuario) {
    return res.status(403).json({ message: ' Usuario no existe' });
  }
  
  req.user = usuario;

  next();
};
 const checkAdmin = (req, res, next) => {

 }


module.exports = { checkToken , checkAdmin};
