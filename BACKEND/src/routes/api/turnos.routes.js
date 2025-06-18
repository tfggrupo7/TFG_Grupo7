// BACKEND/src/routes/api/turnos.routes.js
const router = require('express').Router();
const {
  getAll,
  getById,
  getByDate,        // ← nuevo
  create,
  update,
  remove,
} = require("../../controllers/turnos.controller");

router.get("/date/:fecha", getByDate);  // /api/turnos/date/2025-06-18
router.get("/",          getAll);
router.get("/:turnoId",  getById);
router.post("/",         create);
router.put("/:turnoId",  update);
router.delete("/:turnoId", remove);

module.exports = router;
