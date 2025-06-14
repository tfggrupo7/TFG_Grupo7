const router = require("express").Router();


const {
  getTareasById,
  getAllTareas,
  createTarea,
  updateTarea,
  removeTarea,
  getTareasAndEmpleado,
  getTareasAndEmpleadoById,
  exportTareasPDF,
  sendTareaPDF,
  sendAllTareaEmpleadoPDF,  
  exportTareasEmpleadoPDF
} = require("../../controllers/tarea.controller");


const { checktareaId, checkdataTarea, auth } = require("../../middleware/tareas.middleware");

/**
 * @swagger
 * tags:
 *   name: Tareas
 *   description: Gestión de tareas y exportación de reportes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tarea:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         titulo:
 *           type: string
 *           example: Revisar inventario
 *         descripcion:
 *           type: string
 *           example: Revisar el inventario de la semana
 *         empleadoId:
 *           type: integer
 *           example: 2
 *         fecha:
 *           type: string
 *           format: date
 *           example: "2024-06-14"
 *         estado:
 *           type: string
 *           example: pendiente
 */

/**
 * @swagger
 * /tareas:
 *   get:
 *     summary: Obtiene todas las tareas
 *     tags: [Tareas]
 *     responses:
 *       200:
 *         description: Lista de tareas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tarea'
 */
router.get("/", getAllTareas);
/**
 * @swagger
 * /tareas/tarea:
 *   get:
 *     summary: Obtiene todas las tareas con información de empleados
 *     tags: [Tareas]
 *     responses:
 *       200:
 *         description: Lista de tareas con datos de empleados
 */
router.get("/tarea", getTareasAndEmpleado);
/**
 * @swagger
 * /tareas/export/pdf:
 *   get:
 *     summary: Exporta todas las tareas a PDF
 *     tags: [Tareas]
 *     responses:
 *       200:
 *         description: PDF generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get("/export/pdf", exportTareasPDF);
/**
 * @swagger
 * /tareas/empleado/{empleadoId}/pdf:
 *   get:
 *     summary: Exporta todas las tareas de un empleado a PDF
 *     tags: [Tareas]
 *     parameters:
 *       - in: path
 *         name: empleadoId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: PDF generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get("/empleado/:empleadoId/pdf", exportTareasEmpleadoPDF);
/**
 * @swagger
 * /tareas/tarea/{tareaId}:
 *   get:
 *     summary: Obtiene una tarea y su empleado por ID de tarea
 *     tags: [Tareas]
 *     parameters:
 *       - in: path
 *         name: tareaId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Tarea y datos de empleado
 */
router.get("/tarea/:tareaId", getTareasAndEmpleado);
/**
 * @swagger
 * /tareas/empleado/{empleadoId}:
 *   get:
 *     summary: Obtiene todas las tareas de un empleado por ID
 *     tags: [Tareas]
 *     parameters:
 *       - in: path
 *         name: empleadoId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: Lista de tareas del empleado
 */
router.get("/empleado/:empleadoId", getTareasAndEmpleadoById);
/**
 * @swagger
 * /tareas/{tareaId}:
 *   get:
 *     summary: Obtiene una tarea por ID
 *     tags: [Tareas]
 *     parameters:
 *       - in: path
 *         name: tareaId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Tarea encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarea'
 *       404:
 *         description: Tarea no encontrada
 */
router.get("/:tareaId",checktareaId,getTareasById);
/**
 * @swagger
 * /tareas:
 *   post:
 *     summary: Crea una nueva tarea
 *     tags: [Tareas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tarea'
 *     responses:
 *       201:
 *         description: Tarea creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarea'
 *       400:
 *         description: Datos inválidos
 */
router.post("/",checkdataTarea, createTarea);
/**
 * @swagger
 * /tareas/send/pdf:
 *   post:
 *     summary: Envía por email el PDF de todas las tareas (requiere autenticación)
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF enviado correctamente
 *       401:
 *         description: No autorizado
 */
router.post('/send/pdf',auth, sendTareaPDF);
/**
 * @swagger
 * /tareas/empleado/{empleadoId}/send/pdf:
 *   post:
 *     summary: Envía por email el PDF de todas las tareas de un empleado
 *     tags: [Tareas]
 *     parameters:
 *       - in: path
 *         name: empleadoId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: PDF enviado correctamente
 *       404:
 *         description: Empleado no encontrado
 */
router.post('/empleado/:empleadoId/send/pdf', sendAllTareaEmpleadoPDF);
/**
 * @swagger
 * /tareas/{tareaId}:
 *   put:
 *     summary: Actualiza una tarea existente
 *     tags: [Tareas]
 *     parameters:
 *       - in: path
 *         name: tareaId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tarea'
 *     responses:
 *       200:
 *         description: Tarea actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarea'
 *       404:
 *         description: Tarea no encontrada
 */
router.put("/:tareaId", checktareaId,checkdataTarea,updateTarea);
/**
 * @swagger
 * /tareas/{tareaId}:
 *   delete:
 *     summary: Elimina una tarea por ID
 *     tags: [Tareas]
 *     parameters:
 *       - in: path
 *         name: tareaId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Tarea eliminada correctamente
 *       404:
 *         description: Tarea no encontrada
 */
router.delete("/:tareaId",checktareaId, removeTarea);
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


module.exports = router;
