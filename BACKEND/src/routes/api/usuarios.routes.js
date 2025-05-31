const router = require('express').Router();
const { registro, login, perfil, recuperarContraseña, actualizarContraseña } = require('../../controllers/usuarios.controller');
const { checkToken } = require('../../middleware/auth.middleware');


router.get('/perfil',checkToken, perfil);
router.post('/recuperar-contrasena',recuperarContraseña);
router.post('/restablecer-contrasena/:token',actualizarContraseña);
router.post('/registro', registro);
router.post('/login', login);

module.exports = router;