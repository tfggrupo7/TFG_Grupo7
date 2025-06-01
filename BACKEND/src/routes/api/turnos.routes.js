const router = require('express').Router();

const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../../controllers/turnos.controller");

router.get("/", getAll);
router.get("/:turnoId", getById);
router.post("/", create);
router.put("/:turnoId",update);
router.delete("/:turnoId",remove);
module.exports = router;