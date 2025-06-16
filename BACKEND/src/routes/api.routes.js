const router = require("express").Router();
const {checkToken, checkTokenTurnos} = require('../middleware/auth.middleware')

router.use("/empleados", require("./api/empleados.routes"));
router.use("/tareas", checkToken,require("./api/tareas.routes"));
router.use('/usuarios', require('./api/usuarios.routes'));
router.use('/ingredientes',checkToken, require('./api/ingredientes.routes'));
router.use('/inventario', checkToken,require('./api/inventario.routes'));
router.use('/menus', checkToken,require('./api/menus.routes'));
router.use('/pedidos', checkToken,require('./api/pedidos.routes'));
router.use('/platos', checkToken,require('./api/platos.routes'));
router.use('/roles', require('./api/roles.routes'));
router.use('/turnos', checkTokenTurnos,require('./api/turnos.routes'));
router.use('/menusPlatos', checkToken,require('./api/menusPlatos.routes'))
router.use('/platosIngredientes',checkToken, require('./api/platosIngredientes.routes'))
router.use('/pedidosDetalle', checkToken,require('./api/pedidosDetalle.routes'))

module.exports = router;
