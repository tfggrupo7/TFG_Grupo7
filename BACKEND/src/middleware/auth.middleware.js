const jwt = require("jsonwebtoken");

const Usuario = require("../models/usuarios.model");

const checkToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ message: "No tienes autorizacion"});
  }
  
  const token = req.headers.authorization;
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(403).json({ message: "Token invalido" });
  }
  
  const usuario = await Usuario.getById(payload.usuario_id);
  if(!usuario) {
    return res.status(403).json({ message: 'Usuario no existe'});
  }
  req.user = usuario;

  next();
};

const checkTokenTurnos = async (req, res, next) => {

  if (!req.headers.authorization) {
    return res.status(403).json({ message: "No tienes autorizacion"});
  }
  
  // Extraer solo el token, quitando "Bearer "
  const token = req.headers.authorization.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ message: "Token no proporcionado"});
  }
  
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(403).json({ message: "Token invalido" });
  }
  
  const usuario = await Usuario.getById(payload.usuario_id);
  if(!usuario) {
    return res.status(403).json({ message: 'Usuario no existe'});
  }
  req.user = usuario;

  next();
}

 /*const checkAdmin = (req, res, next) => {
  if (req.usuario.role !== "admin") {
    return res.status(403).json({ message: "No tienes permisos de administrador"});
  }
  
  next();
 }*/

 const checkRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: `Solo pueden pasar los usuarios con role ${role}` });
        }
        next();
    }
}

module.exports = { checkToken ,  checkRole};
