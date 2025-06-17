const router = require('express').Router();

const {
  getAll,
  getById,
  getSummary,
  create,
  update,
  remove,
} = require("../../controllers/ingredientes.controller");

router.get("/", getAll);
router.get("/summary", getSummary);
router.get("/:ingredienteId", getById);

router.post("/", create);
router.put("/:ingredienteId",update);
router.delete("/:ingredienteId",remove);

module.exports = router;