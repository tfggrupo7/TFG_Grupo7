const db = require('../config/db')
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

 
const recuperarContraseña = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'El correo es obligatorio.' });
    }

    // 1. Genera el token plano
    const token = crypto.randomBytes(32).toString('hex');
    // 2. Hashea el token (usa await)
    const tokenHash = await bcrypt.hash(token, 10);
    // 3. Fecha de expiración (1 hora desde ahora, formato compatible con MySQL DATETIME)
    const now = new Date();
    const expires = new Date(now.getTime() + 3600 * 1000); 
    
    // 4. Usa la función del modelo para guardar el token
    const guardado = await Usuario.guardarTokenRecuperacion(email, tokenHash, expires);
    if (!guardado) {
      return res.status(400).json({ message: 'No se pudo guardar el token.' });
    }

    // 5. Envía el email con el token plano
    const resetUrl = `http://localhost:4200/restablecer-contrasena/${token}`;
    await sendEmail(email, 'Recupera tu contraseña', `
      Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}
      Este enlace expirará en 1 hora.
    `);

    res.status(200).json({ message: 'Si el correo existe, se enviará un enlace de recuperación.' });
  } catch (err) {
    console.error('Error al recuperar contraseña:', err);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

const generarYGuardarToken = async (email) => {
  const tokenPlano = require('crypto').randomBytes(32).toString('hex');
  const tokenHash = await bcrypt.hash(tokenPlano, 10);
 const expires = new Date(now.getTime() + 3600 * 1000);

  const guardado = await guardarTokenRecuperacion(email, tokenHash, expires);
  if (guardado) {
    // Aquí deberías enviar el tokenPlano al usuario por email
    return tokenPlano;
  }
  throw new Error('No se pudo guardar el token');
};


const restablecerContraseña = async (req, res) => {
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
    console.error('Error al actualizar la contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = { registro, login, perfil ,recuperarContraseña, restablecerContraseña, generarYGuardarToken }