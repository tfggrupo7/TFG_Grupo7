const router = require("express").Router();

const {
  getAll,
  getById,
  getEmployeesAndTask,
  create,
  update,
  remove,
} = require("../../controllers/employee.controller");

const { checkemployeesId, checkdataEmployee} = require("../../middleware/employees.middleware");

router.get("/", getAll);
router.get("/tasks", getEmployeesAndTask);
router.get("/:employeeId", checkemployeesId, getById);
router.post("/", checkdataEmployee, create);
router.put("/:employeeId", checkdataEmployee, checkemployeesId, update);
router.delete("/:employeeId", checkemployeesId, remove);

module.exports = router;
