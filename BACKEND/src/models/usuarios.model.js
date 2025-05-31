const db = require('../config/db');
const bcrypt = require('bcryptjs');

const insert = async ({ contraseña, email, nombre, apellidos}) => {
const [result] = await db.query('insert into usuarios (contraseña, email, nombre, apellidos) values (?, ?, ?, ?)', [contraseña, email, nombre, apellidos])
return result;
}

const getById = async (usuarioId) => {
  const [result] = await db.query('select * from usuarios where id = ?', [usuarioId]);
  if (result.length === 0) return null;

  return result[0];
}

const getByEmail = async (email) => {
  const [result] = await db.query('select * from usuarios where TRIM(LOWER(email)) = TRIM(LOWER(?))', [email]);
  
  if (result.length === 0) return null;

  return result[0];
}

const recuperarContraseña = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email es obligatorio.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600 * 1000)
    .toISOString().slice(0, 19).replace('T', ' ');

  try {
    await recuperarContraseña(email, token, expires);
    // Aquí puedes enviar el email con el enlace de recuperación
    res.json({ message: 'Si el email existe, se ha enviado un enlace de recuperación.' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const updateContraseñaPorToken = async (token, nuevaContraseña) => {
  // Busca el usuario por el token y verifica que no haya expirado
  const [rows] = await db.query(
    'SELECT id FROM usuarios WHERE reset_password_token = ? AND reset_password_expires > NOW()',
    [token]
  );
  const usuario = rows[0];
  if (!usuario) {
    console.log('Token no encontrado o expirado:', token);
    return null;
  }

  const hashedPassword = bcrypt.hashSync(nuevaContraseña, 10);

  // Actualiza la contraseña y limpia el token y la expiración
  await db.query(
    'UPDATE usuarios SET contraseña = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?',
    [hashedPassword, usuario.id]
  );

  return usuario;
};
module.exports = { insert, getById, getByEmail, recuperarContraseña ,updateContraseñaPorToken };

