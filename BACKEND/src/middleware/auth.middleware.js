const jwt = require("jsonwebtoken");

const Usuario = require("../models/usuarios.model");
const Empleados = require("../models/empleados.model");

/*const checkToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ message: "No tienes autorizacion"});
  }
  
  let token = req.headers.authorization;
  
  // Verificar si el token viene con "Bearer " y extraerlo
  if (token.startsWith('Bearer ')) {
    token = token.slice(7); // Remover "Bearer " (7 caracteres)
  }
  
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(403).json({ message: "Token invalido" });
  }
  
  const usuario = payload.role ? await Empleado.selectById(payload.id) : await Usuario.getById(payload.usuario_id);
  
  if(!usuario) {
    return res.status(403).json({ message: 'Usuario o Empleado no existe'});
  }
  req.user = usuario;

  next();
};*/
const checkToken = async (req, res, next) => {
  try {
    // Extraer token con flexibilidad (con o sin Bearer)
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    // Manejar tanto "Bearer token" como "token" directo
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Intentar primero como usuario
    if (decoded.usuario_id) {
      const usuarioId = decoded.usuario_id;
      if (isNaN(usuarioId)) {
        throw new Error("ID de usuario no válido");
      }

      const usuario = await Usuario.getById(usuarioId);
      if (!usuario) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }

      req.user = usuario;
      req.userType = "usuario";
      return next();
    }

    // Si no es usuario, intentar como empleado
    if (decoded.id) {
      const empleadoId = decoded.id;
      if (isNaN(empleadoId)) {
        throw new Error("ID de empleado no válido");
      }

      const empleado = await Empleados.selectById(empleadoId);
      if (!empleado) {
        return res.status(401).json({ message: "Empleado no encontrado" });
      }

      req.empleado = empleado;
      req.userType = "empleado";
      return next();
    }

    // Si no tiene ninguno de los campos esperados
    throw new Error(
      "Token no contiene información válida de usuario o empleado"
    );
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token inválido" });
  }
};

const checkTokenTurnos = async (req, res, next) => {
  try {
    // Extraer token con flexibilidad (con o sin Bearer)
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    // Manejar tanto "Bearer token" como "token" directo
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Intentar primero como usuario
    if (decoded.usuario_id) {
      const usuarioId = decoded.usuario_id;
      if (isNaN(usuarioId)) {
        throw new Error("ID de usuario no válido");
      }

      const usuario = await Usuario.getById(usuarioId);
      if (!usuario) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }

      req.user = usuario;
      req.userType = "usuario";
      return next();
    }

    // Si no es usuario, intentar como empleado
    if (decoded.id) {
      const empleadoId = decoded.id;
      if (isNaN(empleadoId)) {
        throw new Error("ID de empleado no válido");
      }

      const empleado = await Empleados.selectById(empleadoId);
      if (!empleado) {
        return res.status(401).json({ message: "Empleado no encontrado" });
      }

      req.empleado = empleado;
      req.userType = "empleado";
      return next();
    }

    // Si no tiene ninguno de los campos esperados
    throw new Error(
      "Token no contiene información válida de usuario o empleado"
    );
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token inválido" });
  }
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
      return res
        .status(403)
        .json({ message: `Solo pueden pasar los usuarios con role ${role}` });
    }
    next();
  };
};

module.exports = { checkToken, checkRole, checkTokenTurnos };
