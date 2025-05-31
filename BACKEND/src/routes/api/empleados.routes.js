const router = require("express").Router();

const {
  getAll,
  getById,
  getEmpleadosAndTarea,
  create,
  update,
  remove,
} = require("../../controllers/empleado.controller");

const { checkempleadosId, checkdataEmpleado} = require("../../middleware/empleados.middleware");
const { checkAdmin }=require('../../middleware/auth.middleware')

router.get("/", getAll);
router.get("/tareas", getEmpleadosAndTarea);
router.get("/:empleadoId", checkempleadosId, getById);
router.post("/", checkdataEmpleado, create);
router.put("/:empleadoId",checkdataEmpleado, checkempleadosId, update);
router.delete("/:empleadoId",checkempleadosId, remove);

module.exports = router;
