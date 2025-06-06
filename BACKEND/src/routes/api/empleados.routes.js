const router = require("express").Router();

const {
  getAll,
  getById,
  getEmpleadosAndTarea,
  create,
  update,
  remove,
  getEmpleadosYRoles,login, recuperarContraseña,restablecerContraseña
} = require("../../controllers/empleado.controller");

const { checkempleadosId, checkdataEmpleado} = require("../../middleware/empleados.middleware");


router.get("/", getAll);
router.get("/tareas", getEmpleadosAndTarea);
router.get('/role', getEmpleadosYRoles); 
router.get("/:empleadoId", checkempleadosId, getById);
router.post("/", checkdataEmpleado, create);
router.post('/login', login);
router.post('/recuperar-contrasena', recuperarContraseña);
router.post('/restablecer-contrasena/:token',restablecerContraseña);
router.put("/:empleadoId",checkdataEmpleado, checkempleadosId, update);
router.delete("/:empleadoId",checkempleadosId, remove);

module.exports = router;
