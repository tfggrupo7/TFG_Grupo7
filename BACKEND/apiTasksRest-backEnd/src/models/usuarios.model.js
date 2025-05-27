const db = require('../config/db');

const insert = async ({ contraseña, email, usuario}) => {
const [result] = await db.query('insert into usuarios (contraseña, email, usuario, empleado_id) values (?, ?, ?, ?)', [contraseña, email, usuario, empleado_id])
return result;
}

const getById = async (usuarioId) => {
  const [result] = await db.query('select * from usuarios where id = ?', [usuarioId]);
  if (result.length === 0) return null;

  return result[0];
}

const getByEmail = async (email) => {
  const [result] = await db.query('select * from usuarios where email = ?', [email]);
  if (result.length === 0) return null;

  return result[0];
}

module.exports = { insert, getById, getByEmail };

