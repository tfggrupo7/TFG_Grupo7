const router = require("express").Router();
const {
  checkToken,
  checkTokenTurnos,
} = require("../middleware/auth.middleware");

router.use("/empleados", require("./api/empleados.routes"));
router.use("/tareas", checkToken, require("./api/tareas.routes"));
router.use("/usuarios", require("./api/usuarios.routes"));
router.use("/ingredientes", checkToken, require("./api/ingredientes.routes"));
router.use("/inventario", checkToken, require("./api/inventario.routes"));
router.use("/", require("./api/dialogflow.routes"));
router.use("/roles", require("./api/roles.routes"));
router.use("/turnos", checkTokenTurnos, require("./api/turnos.routes"));

module.exports = router;
