const router = require("express").Router();
// const {checkToken} = require('../middleware/auth.middleware')

router.use("/empleados", require("./api/empleados.routes"));
router.use("/tareas", require("./api/tareas.routes"));
router.use('/usuarios', require('./api/usuarios.routes'));
router.use('/ingredientes', require('./api/ingredientes.routes'));
router.use('/inventario', require('./api/inventario.routes'));
router.use('/menus', require('./api/menus.routes'));
router.use('/pedidos', require('./api/pedidos.routes'));
router.use('/platos', require('./api/platos.routes'));
router.use('/roles', require('./api/roles.routes'));
router.use('/turnos', require('./api/turnos.routes'));


module.exports = router;
