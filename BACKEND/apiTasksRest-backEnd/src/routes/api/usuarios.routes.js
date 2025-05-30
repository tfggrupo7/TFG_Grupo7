const router = require('express').Router();
const { registro, login, perfil } = require('../../controllers/usuarios.controller');
const { checkToken } = require('../../middleware/auth.middleware');


router.get('/perfil',checkToken, perfil);
router.post('/registro', registro);
router.post('/login', login);

module.exports = router;