const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios.model');
const crypto = require('crypto');
const sendEmail = require('../sendEmail');

const registro = async (req, res) => {
    req.body.contraseña = bcrypt.hashSync(req.body.contraseña, 10);
    const result = await Usuario.insert(req.body);
    const usuario = await Usuario.getById(result.insertId);

res.json(usuario);
}

const login = async (req, res) => { 
    const { email, contraseña } = req.body;
    console.log('Email recibido:', email);
    console.log('Contraseña recibida:', contraseña);
    const usuario = await Usuario.getByEmail(email);
    if (!usuario) {
        console.log('Usuario no encontrado');
        return res.status(401).json({ message: 'Usuario y/o contraseña incorrectos'});
    }
    console.log('Usuario encontrado:', usuario);
    const validPassword = bcrypt.compareSync(contraseña, usuario.contraseña);
    if (!validPassword) {
        return res.status(401).json({ message: 'Usuario y/o contraseña incorrectos'});
    }
    res.json({ message: 'Login exitoso',
               token: jwt.sign({ usuario_id: usuario.id, role: usuario.role }, process.env.JWT_SECRET, { expiresIn: '1h' })   
            }
    );
}

const perfil = async (req, res) => {
    
    res.json(req.user);
}

 // Asegúrate de requerir crypto al inicio del archivo si no está

const recuperarContraseña = async (req, res) => {
  try {
    const token = crypto.randomBytes(32).toString('hex');
    const { email } = req.body;
    const usuario = await Usuario.recuperarContraseña(email);
    if (!usuario) {
      return res.status(200).json({ message: 'Si el correo existe, se enviará un enlace de recuperación.' });
    }
    // Aquí deberías enviar el correo con el enlace de recuperación
    const resetUrl = `http://localhost:4200/restablecer-contrasena/${token}`;

    // Envía el email
    await sendEmail(email, 'Recupera tu contraseña', `
      Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}
      Este enlace expirará en 1 hora.
    `);

    res.status(200).json({ message: 'Si el correo existe, se enviará un enlace de recuperación.' });
  } catch (err) {
    console.error('Error al recuperar contraseña:', err);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
}

const actualizarContraseña = async (req, res) => {
  const { nuevaContrasena } = req.body;
  const token = req.params.token;

  if (!nuevaContrasena || typeof nuevaContrasena !== 'string') {
    return res.status(400).json({ message: 'La nueva contraseña es obligatoria.' });
  }
  if (!token) {
    return res.status(400).json({ message: 'Token de recuperación no proporcionado.' });
  }

  try {
    const usuario = await Usuario.updateContraseñaPorToken(token, nuevaContrasena);
    if (!usuario) {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }
    res.json({ message: 'Contraseña actualizada exitosamente.' });
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error); // <-- Esto es clave
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = { registro, login, perfil ,recuperarContraseña, actualizarContraseña };