const router = require('express').Router();

const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../../controllers/pedidos.controller");

router.get("/", getAll);
router.get("/:pedidoId", getById);
router.post("/", create);
router.put("/:pedidoId",update);
router.delete("/:pedidoId",remove);

module.exports = router;