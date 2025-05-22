const db = require('../config/db');

const insert = async ({ username, email, password}) => {
const [result] = await db.query('insert into usuario (username, email, password) values (?, ?, ?)', [username, email, password])
return result;
}

const getById = async (usuarioId) => {
  const [result] = await db.query('select * from usuario where id = ?', [usuarioId]);
  if (result.length === 0) return null;

  return result[0];
}

const getByEmail = async (email) => {
  const [result] = await db.query('select * from usuario where email = ?', [email]);
  if (result.length === 0) return null;

  return result[0];
}

module.exports = { insert, getById, getByEmail };

