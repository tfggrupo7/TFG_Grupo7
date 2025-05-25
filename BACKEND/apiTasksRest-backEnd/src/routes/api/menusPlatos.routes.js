const router = require('express').Router();

const { getAll, create, remove} = require('../../controllers/menusPlatos.controller')

router.get("/", getAll);
router.post("/", create);
router.delete("/menus/:menuId", remove)

module.exports = router;