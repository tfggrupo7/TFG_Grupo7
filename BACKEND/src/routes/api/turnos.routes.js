// BACKEND/src/routes/api/turnos.routes.js
const router = require("express").Router();
const {
  getAll,
  getById,
  getByDate, 
  getByEmpleadoId,
  getTurnosByDateAndEmpleado, // ← nuevo, para obtener turnos por empleado
  create,
  update,
  remove,
} = require("../../controllers/turnos.controller");

router.get("/date/:fecha", getByDate); 
router.get("/", getAll);
router.get("/fecha/:fecha/empleado/:empleadoId", getTurnosByDateAndEmpleado); // ← nuevo, para obtener turnos por fecha y empleado
router.get('/empleado/:empleadoId', getByEmpleadoId); // ← nuevo, para obtener turnos por empleado
router.get("/:turnoId", getById);
router.post("/", create);
router.put("/:turnoId", update);
router.delete("/:turnoId", remove);

module.exports = router;
