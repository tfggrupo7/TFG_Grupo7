const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuarios.model");
const CryptoJS = require("crypto-js");
const sendEmail = require("../sendEmail");

const getByUsuarioId = async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId;

    if (!usuarioId) {
      return res.status(400).json({ message: "ID de usuario requerido" });
    }

    const id = parseInt(usuarioId, 10);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    const usuario = await Usuario.getById(id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const { password, ...usuarioSinPassword } = usuario;
    return res.status(200).json(usuarioSinPassword);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const registro = async (req, res) => {
  try {
    const { email } = req.body;

    // Verificar si el email ya existe ANTES de insertar
    const usuarioExistente = await Usuario.getByEmail(email);

    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: "El email ya está registrado.",
      });
    }

    // Si no existe, proceder con el registro
    req.body.contraseña = bcrypt.hashSync(req.body.contraseña, 10);
    const result = await Usuario.insert(req.body);
    const usuario = await Usuario.getById(result.insertId);

    res.status(201).json({
      success: true,
      usuario: usuario,
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

const login = async (req, res) => {
  const { email, contraseña } = req.body;
  const usuario = await Usuario.getByEmail(email);
  if (!usuario) {
    return res
      .status(401)
      .json({ message: "Usuario y/o contraseña incorrectos" });
  }
  const validPassword = bcrypt.compareSync(contraseña, usuario.contraseña);
  if (!validPassword) {
    return res
      .status(401)
      .json({ message: "Usuario y/o contraseña incorrectos" });
  }
  res.json({
    message: "Login exitoso",
    token: jwt.sign(
      { usuario_id: usuario.id, role: usuario.role, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    ),
  });
};

const perfil = async (req, res) => {
  res.json(req.user);
};

const recuperarContraseña = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "El correo es obligatorio." });
    }
    // 1. Genera el token plano con crypto-js
    const randomWords = CryptoJS.lib.WordArray.random(32); // 32 bytes
    const token = randomWords.toString(CryptoJS.enc.Hex);
    /*// 1. Genera el token plano
    const token = crypto.randomBytes(32).toString('hex');
    */
    // 2. Hashea el token (usa await)
    const tokenHash = await bcrypt.hash(token, 10);
    // 3. Fecha de expiración (1 hora desde ahora, formato compatible con MySQL DATETIME)
    const now = new Date();
    const expires = new Date(now.getTime() + 3600 * 1000);

    // 4. Usa la función del modelo para guardar el token
    const guardado = await Usuario.guardarTokenRecuperacion(
      email,
      tokenHash,
      expires
    );
    if (!guardado) {
      return res.status(400).json({ message: "No se pudo guardar el token." });
    }

    // 5. Envía el email con el token plano
    const resetUrl = `http://localhost:4200/restablecer-contrasena/${token}`;
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <title>ChefDesk - Cambia tu contraseña</title>
  </head>
  <body style="margin:0; padding:0; background:#f6f8fa; font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fa; min-height:100vh;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.07); margin:40px 0;">
            <tr>
              <td style="padding:32px 32px 16px 32px;">
                <div style="display:flex; align-items:center;">
                  <!-- Pega aquí el contenido de tu SVG -->
                  <div style="width:80px; height:80px; margin-right:16px;">
                   <img src="cid:logo" width="60" height="60" style="margin-right:16px;">
                  </div>
                  <span style="font-size:2rem; font-weight:700; color:#2d3748;">ChefDesk</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px 32px;">
                <p style="font-size:1.1rem; color:#4a5568; margin-top:24px;">
                  Para cambiar tu contraseña, por favor haz click en el siguiente enlace. Una vez dentro, podrás actualizar tu contraseña de forma segura.
                </p>
                <div style="margin:32px 0 0 0; text-align:center;">
                  <a href="${resetUrl}" style="background:#3182ce; color:#fff; text-decoration:none; padding:12px 32px; border-radius:6px; font-weight:600; font-size:1rem; display:inline-block;">
                    Cambiar Contraseña
                  </a>
                </div>
                <p style="font-size:1rem; color:#718096; margin-top:24px;">
                  El cambio de contraseña solo tendrá efecto si se realiza dentro de la hora siguiente a la solicitud.
                </p>
                <p style="font-size:0.95rem; color:#a0aec0; margin-top:32px; text-align:center;">
                  Si no has solicitado este cambio, puedes ignorar este mensaje.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

    await sendEmail(
      email,
      "Recupera tu contraseña",
      `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}\nEste enlace expirará en 1 hora.`,
      htmlTemplate
    );
    res.status(200).json({
      message: "Si el correo existe, se enviará un enlace de recuperación.",
    });
  } catch (err) {
    console.error("Error al recuperar contraseña:", err);
    res.status(500).json({ message: "Error en el servidor." });
  }
};

const generarYGuardarToken = async (email) => {
  const tokenPlano = CryptoJS.lib.WordArray.random(32).toString(
    CryptoJS.enc.Hex
  );
  /*const tokenPlano = require('crypto').randomBytes(32).toString('hex');*/
  const tokenHash = await bcrypt.hash(tokenPlano, 10);
  const expires = new Date(now.getTime() + 3600 * 1000);

  const guardado = await guardarTokenRecuperacion(email, tokenHash, expires);
  if (guardado) {
    // Aquí deberías enviar el tokenPlano al usuario por email
    return tokenPlano;
  }
  throw new Error("No se pudo guardar el token");
};

const restablecerContraseña = async (req, res) => {
  const { nuevaContrasena } = req.body;
  const token = req.params.token;

  if (!nuevaContrasena || typeof nuevaContrasena !== "string") {
    return res
      .status(400)
      .json({ message: "La nueva contraseña es obligatoria." });
  }
  if (!token) {
    return res
      .status(400)
      .json({ message: "Token de recuperación no proporcionado." });
  }

  try {
    const usuario = await Usuario.updateContraseñaPorToken(
      token,
      nuevaContrasena
    );
    if (!usuario) {
      return res.status(400).json({ message: "Token inválido o expirado." });
    }
    res.json({ message: "Contraseña actualizada exitosamente." });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

const cambiarContraseña = async (req, res) => {
  const { nuevaContraseña } = req.body;
  const usuarioId = req.user.id;

  if (!nuevaContraseña || typeof nuevaContraseña !== "string") {
    return res
      .status(400)
      .json({ message: "La nueva contraseña es obligatoria." });
  }

  try {
    const result = await Usuario.cambiarContraseña(usuarioId, nuevaContraseña);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const actualizarDatos = async (req, res) => {
  const { nombre, apellidos, email } = req.body;
  const usuarioId = req.user.id;

  try {
    const result = await Usuario.updateDatos(usuarioId, {
      nombre,
      apellidos,
      email,
    });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Datos actualizados correctamente" });
  } catch (error) {
    console.error("Error al actualizar los datos del usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.user.id;
  if (usuarioId !== Number.parseInt(id)) {
    return res
      .status(403)
      .json({ message: "No tienes permiso para eliminar este usuario." });
  }
  try {
    const result = await Usuario.deleteUsuario(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  registro,
  getByUsuarioId,
  login,
  perfil,
  recuperarContraseña,
  restablecerContraseña,
  generarYGuardarToken,
  actualizarDatos,
  cambiarContraseña,
  eliminarUsuario,
};
