// BACKEND/src/routes/api/turnos.routes.js
const router = require("express").Router();
const {
  getAll,
  getById,
  getByDate,
  getByEmpleadoId,
  getTurnosByDateAndEmpleado,
  create,
  update,
  remove,
  exportTurnosPDF,
  exportTurnosEmpleadoPDF,
  sendAllTurnoEmpleadoPDF,
  sendTurnoPDF,
  getByDateQuery,
} = require("../../controllers/turnos.controller");

const { auth } = require("../../middleware/turnos.middleware");

/**
 * @swagger
 * /date/{fecha}:
 *   get:
 *     summary: Obtiene turnos por fecha (parámetro en path)
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha para filtrar turnos (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de turnos para la fecha indicada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Turno'
 */
router.get("/date/:fecha", getByDate);
/**
 * @swagger
 * /:
 *   get:
 *     summary: Obtiene todos los turnos
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Lista completa de turnos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Turno'
 */
router.get("/", getAll);
/**
 * @swagger
 * /export/pdf:
 *   get:
 *     summary: Exporta todos los turnos en PDF
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Archivo PDF con todos los turnos
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get("/export/pdf", exportTurnosPDF);
/**
 * @swagger
 * /empleado/{empleadoId}/pdf:
 *   get:
 *     summary: Exporta los turnos de un empleado en PDF
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: empleadoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: Archivo PDF con los turnos del empleado
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get("/empleado/:empleadoId/pdf", exportTurnosEmpleadoPDF);
/**
 * @swagger
 * /fecha/{fecha}/empleado/{empleadoId}:
 *   get:
 *     summary: Obtiene turnos por fecha y empleado
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha para filtrar turnos (YYYY-MM-DD)
 *       - in: path
 *         name: empleadoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: Lista de turnos para la fecha y empleado indicados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Turno'
 */
router.get("/fecha/:fecha/empleado/:empleadoId", getTurnosByDateAndEmpleado); // ← nuevo, para obtener turnos por fecha y empleado
/**
 * @swagger
 * /by-date:
 *   get:
 *     summary: Obtiene turnos por fecha (parámetro en query)
 *     tags: [Turnos]
 *     parameters:
 *       - in: query
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha para filtrar turnos (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de turnos para la fecha indicada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Turno'
 */
router.get("/by-date", getByDateQuery); // ← nuevo, para obtener turnos por fecha
/**
 * @swagger
 * /empleado/{empleadoId}:
 *   get:
 *     summary: Obtiene turnos por ID de empleado
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: empleadoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: Lista de turnos del empleado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Turno'
 */
router.get("/empleado/:empleadoId", getByEmpleadoId); // ← nuevo, para obtener turnos por empleado
/**
 * @swagger
 * /{turnoId}:
 *   get:
 *     summary: Obtiene un turno por su ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: turnoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del turno
 *     responses:
 *       200:
 *         description: Turno encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turno'
 *       404:
 *         description: Turno no encontrado
 */
router.get("/:turnoId", getById);
/**
 * @swagger
 * /send/pdf:
 *   post:
 *     summary: Envía un PDF de turno (requiere autenticación)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos para enviar el PDF del turno
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendTurnoPDFInput'
 *     responses:
 *       200:
 *         description: PDF enviado exitosamente
 */
router.post("/send/pdf", auth, sendTurnoPDF);
/**
 * @swagger
 * /empleado/{empleadoId}/send/pdf:
 *   post:
 *     summary: Envía todos los PDFs de turnos de un empleado
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: empleadoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del empleado
 *     requestBody:
 *       description: Datos para enviar los PDFs
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendAllTurnoEmpleadoPDFInput'
 *     responses:
 *       200:
 *         description: PDFs enviados exitosamente
 */
router.post("/empleado/:empleadoId/send/pdf", sendAllTurnoEmpleadoPDF);
/**
 * @swagger
 * /:
 *   post:
 *     summary: Crea un nuevo turno
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TurnoInput'
 *     responses:
 *       201:
 *         description: Turno creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turno'
 */
router.post("/", create);
/**
 * @swagger
 * /{turnoId}:
 *   put:
 *     summary: Actualiza un turno por su ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: turnoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del turno a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TurnoInput'
 *     responses:
 *       200:
 *         description: Turno actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turno'
 *       404:
 *         description: Turno no encontrado
 */
router.put("/:turnoId", update);
/**
 * @swagger
 * /{turnoId}:
 *   delete:
 *     summary: Elimina un turno por su ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: turnoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del turno a eliminar
 *     responses:
 *       204:
 *         description: Turno eliminado exitosamente
 *       404:
 *         description: Turno no encontrado
 */
router.delete("/:turnoId", remove);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Turno:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "turno123"
 *         fecha:
 *           type: string
 *           format: date
 *           example: "2025-06-26"
 *         empleadoId:
 *           type: string
 *           example: "emp456"
 *         descripcion:
 *           type: string
 *           example: "Turno de mañana"
 *       required:
 *         - id
 *         - fecha
 *         - empleadoId
 *     TurnoInput:
 *       type: object
 *       properties:
 *         fecha:
 *           type: string
 *           format: date
 *           example: "2025-06-26"
 *         empleadoId:
 *           type: string
 *           example: "emp456"
 *         descripcion:
 *           type: string
 *           example: "Turno de mañana"
 *       required:
 *         - fecha
 *         - empleadoId
 *     SendTurnoPDFInput:
 *       type: object
 *       properties:
 *         turnoId:
 *           type: string
 *           example: "turno123"
 *         email:
 *           type: string
 *           format: email
 *           example: "usuario@ejemplo.com"
 *       required:
 *         - turnoId
 *         - email
 *     SendAllTurnoEmpleadoPDFInput:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "usuario@ejemplo.com"
 *       required:
 *         - email
 */

module.exports = router;
