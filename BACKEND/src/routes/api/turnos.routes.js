// BACKEND/src/routes/api/turnos.routes.js
const router = require("express").Router();
const {
  getAll,
  getById,
  getByDate, 
  getByEmpleadoId,
  getTurnosByDateAndEmpleado, 
  create,
  update,
  remove,
  exportTurnosPDF,
  exportTurnosEmpleadoPDF,
  sendAllTurnoEmpleadoPDF,
  sendTurnoPDF, 
} = require("../../controllers/turnos.controller");

const { auth } = require("../../middleware/turnos.middleware");

router.get("/date/:fecha", getByDate); 
router.get("/", getAll);
router.get("/export/pdf", exportTurnosPDF);
router.get("/empleado/:empleadoId/pdf", exportTurnosEmpleadoPDF);
router.get("/fecha/:fecha/empleado/:empleadoId", getTurnosByDateAndEmpleado); // ← nuevo, para obtener turnos por fecha y empleado
router.get('/empleado/:empleadoId', getByEmpleadoId); // ← nuevo, para obtener turnos por empleado
router.get("/:turnoId", getById);
router.post('/send/pdf',auth, sendTurnoPDF);
router.post('/empleado/:empleadoId/send/pdf', sendAllTurnoEmpleadoPDF);
router.post("/", create);
router.put("/:turnoId", update);
router.delete("/:turnoId", remove);

module.exports = router;
