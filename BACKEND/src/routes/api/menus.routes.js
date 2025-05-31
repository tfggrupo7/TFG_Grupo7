const router = require('express').Router();

const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../../controllers/menus.controller");

router.get("/", getAll);
router.get("/:menuId", getById);
router.post("/", create);
router.put("/:menuId",update);
router.delete("/:menuId",remove);

module.exports = router;