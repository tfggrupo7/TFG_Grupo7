const router = require('express').Router();

const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../../controllers/roles.controller");

router.get("/", getAll);
router.get("/:rolId", getById);
router.post("/", create);
router.put("/:rolId",update);
router.delete("/:rolId",remove);

module.exports = router;