const router = require('express').Router();

const { getAll, create, remove} = require('../../controllers/pedidosDetalle.controller')

router.get("/", getAll);
router.post("/", create);
router.delete("/:pedido/pedidoId", remove)

module.exports = router;