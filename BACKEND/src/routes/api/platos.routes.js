const router = require('express').Router();

const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../../controllers/platos.controller");

router.get("/", getAll);
router.get("/:platoId", getById);
router.post("/", create);
router.put("/:platoId",update);
router.delete("/:platoId",remove);

module.exports = router;