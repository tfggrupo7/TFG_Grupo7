const db = require("../config/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const insert = async ({ contraseña, email, nombre, apellidos }) => {
  const [result] = await db.query(
    "insert into usuarios (contraseña, email, nombre, apellidos) values (?, ?, ?, ?)",
    [contraseña, email, nombre, apellidos]
  );
  return result;
};

const getById = async (usuarioId) => {
  const [result] = await db.query("select * from usuarios where id = ?", [
    usuarioId,
  ]);
  if (result.length === 0) return null;

  return result[0];
};

const getByEmail = async (email) => {
  const [result] = await db.query(
    "select * from usuarios where TRIM(LOWER(email)) = TRIM(LOWER(?))",
    [email]
  );

  if (result.length === 0) return null;

  return result[0];
};

const updateDatos = async (usuarioId, { nombre, apellidos, email }) => {
  const [result] = await db.query(
    "update usuarios set nombre = ?, apellidos = ? , email = ? where id = ?",
    [nombre, apellidos, email, usuarioId]
    );
  return result;
};



const guardarTokenRecuperacion = async (email, tokenHash, expires) => {
  const [result] = await db.query(
    "UPDATE usuarios SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?",
    [tokenHash, expires, email]
  );
  return result.affectedRows > 0;
};

const recuperarContraseña = async (email, token, expires) => {
  console.log("Intentando guardar token para:", email, token, expires);
  const [result] = await db.query("SELECT * FROM usuarios WHERE email = ?", [
    email,
  ]);
  if (result.length === 0) {
    console.log("No existe usuario con ese email");
    return null;
  }
  const updateResult = await db.query(
    "UPDATE usuarios SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?",
    [token, expires, email]
  );
  console.log("Resultado del UPDATE:", updateResult);
  return true;
};

const updateContraseñaPorToken = async (tokenPlano, nuevaContraseña) => {
  const [rows] = await db.query(
    "SELECT id, reset_password_token FROM usuarios WHERE reset_password_token IS NOT NULL AND reset_password_expires > NOW()"
  );

  let usuario = null;
  for (const row of rows) {
    if (await bcrypt.compareSync(tokenPlano, row.reset_password_token)) {
      usuario = row;
      break;
    }
  }

  if (!usuario) {
    return null;
  }

  const hashedPassword = await bcrypt.hashSync(nuevaContraseña, 10);

  await db.query(
    "UPDATE usuarios SET contraseña = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?",
    [hashedPassword, usuario.id]
  );

  return usuario;
};

module.exports = {
  insert,
  getById,
  getByEmail,
  recuperarContraseña,
  guardarTokenRecuperacion,
  updateContraseñaPorToken,
  updateDatos
};
