const router = require("express").Router();

router.use("/employees", require("./api/employees.routes"));
router.use("/tasks", require("./api/tasks.routes"));
router.use('/usuarios', require('./api/usuarios.routes'));


module.exports = router;
