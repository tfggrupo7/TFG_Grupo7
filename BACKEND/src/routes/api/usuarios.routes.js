const router = require('express').Router();
const { registro, login, perfil, recuperarContraseña, restablecerContraseña, actualizarDatos } = require('../../controllers/usuarios.controller');
const { checkToken } = require('../../middleware/auth.middleware');


router.get('/perfil',checkToken, perfil);
router.post('/recuperar-contrasena',recuperarContraseña);
router.post('/restablecer-contrasena/:token',restablecerContraseña);
router.post('/registro', registro);
router.post('/login', login);
router.put('/',checkToken,actualizarDatos);
module.exports = router;