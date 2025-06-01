const router = require('express').Router();

const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../../controllers/inventario.controller");

router.get("/", getAll);
router.get("/:inventarioId", getById);
router.post("/", create);
router.put("/:inventarioId",update);
router.delete("/:inventarioId",remove);

module.exports = router;