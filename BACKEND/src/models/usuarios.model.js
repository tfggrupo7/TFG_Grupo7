const db = require('../config/db');

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

module.exports = { insert, getById, getByEmail };

