const Empleado = require("../models/empleados.model");
const Tarea = require("../models/tareas.model");
const Role = require("../models/rol.model");
const CryptoJS = require("crypto-js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../sendEmail");


// Login 

const login = async (req, res) => {
  const { email, password } = req.body;
  const empleado = await Empleado.getByEmail(email); 
  if (!empleado) {
    return res
      .status(401)
      .json({ message: "Usuario y/o contraseña incorrectos" });
  }
  const validPassword = bcrypt.compareSync(password, empleado.password);
  if (!validPassword) {
    return res
      .status(401)
      .json({ message: "Usuario y/o contraseña incorrectos" });
  }
  res.json({
    message: "Login exitoso",
    token: jwt.sign(
      { id: empleado.id, role: empleado.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    ),
  });
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
    const guardado = await Empleado.guardarTokenRecuperacion(
      email,
      tokenHash,
      expires
    );
    if (!guardado) {
      return res.status(400).json({ message: "No se pudo guardar el token." });
    }

    // 5. Envía el email con el token plano
    const resetUrl = `http://localhost:4200/empleados/restablecer-contrasena/${token}`;
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
    res
      .status(200)
      .json({
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
    const empleado = await Empleado.updateContraseñaPorToken(
      token,
      nuevaContrasena
    );
    if (!empleado) {
      return res.status(400).json({ message: "Token inválido o expirado." });
    }
    res.json({ message: "Contraseña actualizada exitosamente." });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Autor Controller
const getAll = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const empleado = await Empleado.selectAll();
    res.json(
    
    empleado
  );
};

const getById = async (req, res) => {
  /*const { empleadoId } = req.params;
  const empleado = await Empleado.selectById(empleadoId);
 
  res.json(empleado);*/
  res.json(req.empleados);
};

const getEmpleadosAndTarea = async (req, res) => {
  const empleados = await Empleado.selectAll(1, 500);

  for (const empleado of empleados) {
    const tareas = await Tarea.selectByEmpleadoId(empleado.id);
    empleado.tareas = tareas;
  }

  res.json(empleados);
};

const create = async (req, res) => {
  const result = await Empleado.insert(req.body);
  const { nombre, email, telefono, rol_id, salario, status, activo, fecha_inicio , usuario_id} = req.body;
  const empleado = await Empleado.selectById(result.insertId);

  res.json(empleado);
};

const update = async (req, res) => {
  const { empleadoId } = req.params;
  const result = await Empleado.update(empleadoId, req.body);
  const { nombre, email, telefono, rol_id, salario, status, activo, fecha_inicio } = req.body;
  const empleado = await Empleado.selectById(empleadoId);

  res.json(empleado);
};

const remove = async (req, res) => {
  const { empleadoId } = req.params;
  const result = await Empleado.remove(empleadoId);
  const empleados = await Empleado.selectAll(1, 1000);

  res.json({ message: "Empleado eliminado", data: empleados });
};

const getEmpleadosYRoles = async (req, res) => {
  try {
    // 1. Obtener todos los empleados
    const empleados = await Empleado.selectAll();

    // 2. Para cada empleado, obtener su rol y añadirlo al objeto empleado
    const empleadosConRol = await Promise.all(
      empleados.map(async (empleado) => {
        const role = await Role.selectById(empleado.rol_id);
        return {
          ...empleado,
          role: role
        };
      })
    );

    // 3. Devolver el array de empleados con su rol
    res.json(empleadosConRol);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener empleados y roles", error });
  }
};


module.exports = { getAll, getById, create, getEmpleadosAndTarea, update, remove, getEmpleadosYRoles, login, recuperarContraseña, restablecerContraseña, generarYGuardarToken };
