const router = require("express").Router();

const {
  getAll,
  getById,
  getEmpleadosAndTarea,
  create,
  update,
  remove,
  getEmpleadosYRoles,login, recuperarContraseña,restablecerContraseña,
  updateEmpleado,
  cambiarContraseña
} = require("../../controllers/empleado.controller");


const { checkempleadosId, checkdataEmpleado, checkdataEmpleadoUpdate, checkEmpleadoId} = require("../../middleware/empleados.middleware");


router.get("/", getAll);
router.get("/tareas", getEmpleadosAndTarea);
router.get('/role', getEmpleadosYRoles); 
router.get("/:empleadoId", checkempleadosId, getById);
router.post("/", checkdataEmpleado, create);
router.post('/login', login);
router.post('/recuperar-contrasena', recuperarContraseña);
router.post('/restablecer-contrasena/:token',restablecerContraseña);
router.post('/cambiar-contrasena/:empleadoId',checkempleadosId, cambiarContraseña)
router.put('/updateEmpleado/:empleadoId', checkempleadosId, checkdataEmpleadoUpdate, updateEmpleado);
router.put("/:empleadoId",checkdataEmpleado, checkempleadosId, update);
router.delete("/:empleadoId",checkempleadosId, remove);

module.exports = router;
