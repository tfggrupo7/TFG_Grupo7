const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios.model');

const registro = async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const result = await Usuario.insert(req.body);
    const usuario = await Usuario.getById(result.insertId);

res.json(usuario);
}

const login = async (req, res) => { 
    const { email, password } = req.body;
    const usuario = await Usuario.getByEmail(email);
    if (!usuario) {
        return res.status(401).json({ message: 'Usuario y/o contraseña incorrectos'});
    }
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
        return res.status(401).json({ message: 'Usuario y/o contraseña incorrectos'});
    }
    res.json({ message: 'Login exitoso',
               token: jwt.sign({ usuario_id: usuario.id, role: usuario.role }, process.env.JWT_SECRET, { expiresIn: '1h' })   
            }
    );
}

module.exports = { registro, login}