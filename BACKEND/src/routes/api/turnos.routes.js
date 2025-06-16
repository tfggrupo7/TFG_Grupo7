const router = require('express').Router();

const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../../controllers/turnos.controller");

/**
 * @swagger
 * /turnos:
 *   get:
 *     summary: Obtiene todos los turnos
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turnos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Turno'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", getAll);
/**
 * @swagger
 * /turnos/{turnoId}:
 *   get:
 *     summary: Obtiene un turno por ID
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turnoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del turno a obtener
 *     responses:
 *       200:
 *         description: Turno encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turno'
 *       404:
 *         description: Turno no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:turnoId", getById);
/**
 * @swagger
 * /turnos:
 *   post:
 *     summary: Crea un nuevo turno
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
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
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", create);
/**
 * @swagger
 * /turnos/{turnoId}:
 *   put:
 *     summary: Actualiza un turno por ID
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
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
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Turno no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/:turnoId",update);
/**
 * @swagger
 * /turnos/{turnoId}:
 *   delete:
 *     summary: Elimina un turno por ID
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turnoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del turno a eliminar
 *     responses:
 *       200:
 *         description: Turno eliminado exitosamente
 *       404:
 *         description: Turno no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/:turnoId",remove);
/**
 * @swagger
 * components:
 *   schemas:
 *     Turno:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del turno
 *         nombre:
 *           type: string
 *           description: Nombre del turno
 *         horaInicio:
 *           type: string
 *           format: time
 *           description: Hora de inicio del turno
 *         horaFin:
 *           type: string
 *           format: time
 *           description: Hora de fin del turno
 *         activo:
 *           type: boolean
 *           description: Estado del turno
 *       example:
 *         id: "507f1f77bcf86cd799439011"
 *         nombre: "Turno Mañana"
 *         horaInicio: "08:00"
 *         horaFin: "16:00"
 *         activo: true
 *     
 *     TurnoInput:
 *       type: object
 *       required:
 *         - nombre
 *         - horaInicio
 *         - horaFin
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del turno
 *         horaInicio:
 *           type: string
 *           format: time
 *           description: Hora de inicio del turno
 *         horaFin:
 *           type: string
 *           format: time
 *           description: Hora de fin del turno
 *         activo:
 *           type: boolean
 *           description: Estado del turno
 *           default: true
 *       example:
 *         nombre: "Turno Tarde"
 *         horaInicio: "14:00"
 *         horaFin: "22:00"
 *         activo: true
 */
module.exports = router;