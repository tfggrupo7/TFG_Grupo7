const router = require("express").Router();

router.use("/employees", require("./api/employees.routes"));
router.use("/tasks", require("./api/tasks.routes"));

module.exports = router;
