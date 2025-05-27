const router = require('express').Router();

const { getAll, create, remove} = require('../../controllers/menusPlatos.controller')

router.get("/", getAll);
router.post("/", create);
router.delete("/menusPlatos/:menuId/:platoId", remove)

module.exports = router;