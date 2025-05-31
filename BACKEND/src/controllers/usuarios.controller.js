const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios.model');

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

module.exports = { registro, login, perfil }