const router = require("express").Router();


const {
  getTareasById,
  getAllTareas,
  createTarea,
  updateTarea,
  removeTarea,
  getTareasAndEmpleado,
  getTareasAndEmpleadoById,
  exportTareasPDF,
  sendTareaPDF,
  sendAllTareaEmpleadoPDF,  
  exportTareasEmpleadoPDF
} = require("../../controllers/tarea.controller");


const { checktareaId, checkdataTarea, auth } = require("../../middleware/tareas.middleware");


router.get("/", getAllTareas);
router.get("/tarea", getTareasAndEmpleado);
router.get("/export/pdf", exportTareasPDF);
router.get("/empleado/:empleadoId/pdf", exportTareasEmpleadoPDF);

router.get("/tarea/:tareaId", getTareasAndEmpleado);
router.get("/empleado/:empleadoId", getTareasAndEmpleadoById);
router.get("/:tareaId",checktareaId,getTareasById);
router.post("/",checkdataTarea, createTarea);
router.post('/send/pdf',auth, sendTareaPDF);
router.post('/empleado/:empleadoId/send/pdf', sendAllTareaEmpleadoPDF);
router.put("/:tareaId", checktareaId,checkdataTarea,updateTarea);
router.delete("/:tareaId",checktareaId, removeTarea);


module.exports = router;
