const router = require('express').Router();

const {
  getAll,
  getById,
  getSummary,
  create,
  update,
  remove,
  AllIngredientes,
} = require("../../controllers/ingredientes.controller");

/**
 * @swagger
 * /:
 *   get:
 *     summary: Obtiene todos los ingredientes (versión simple)
 *     tags: [Ingredientes]
 *     responses:
 *       200:
 *         description: Lista de ingredientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ingrediente'
 */
router.get("/", getAll);
/**
 * @swagger
 * /all:
 *   get:
 *     summary: Obtiene todos los ingredientes (versión completa)
 *     tags: [Ingredientes]
 *     responses:
 *       200:
 *         description: Lista completa de ingredientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ingrediente'
 */
router.get("/all", AllIngredientes);
/**
 * @swagger
 * /summary:
 *   get:
 *     summary: Obtiene un resumen de ingredientes
 *     tags: [Ingredientes]
 *     responses:
 *       200:
 *         description: Resumen de ingredientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total de ingredientes
 *                 otrosDatos:
 *                   type: string
 *                   description: Otros datos resumidos
 */
router.get("/summary", getSummary);
/**
 * @swagger
 * /{ingredienteId}:
 *   get:
 *     summary: Obtiene un ingrediente por su ID
 *     tags: [Ingredientes]
 *     parameters:
 *       - in: path
 *         name: ingredienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ingrediente
 *     responses:
 *       200:
 *         description: Ingrediente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ingrediente'
 *       404:
 *         description: Ingrediente no encontrado
 */
router.get("/:ingredienteId", getById);
/**
 * @swagger
 * /:
 *   post:
 *     summary: Crea un nuevo ingrediente
 *     tags: [Ingredientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IngredienteInput'
 *     responses:
 *       201:
 *         description: Ingrediente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ingrediente'
 */
router.post("/", create);
/**
 * @swagger
 * /{ingredienteId}:
 *   put:
 *     summary: Actualiza un ingrediente por su ID
 *     tags: [Ingredientes]
 *     parameters:
 *       - in: path
 *         name: ingredienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ingrediente a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IngredienteInput'
 *     responses:
 *       200:
 *         description: Ingrediente actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ingrediente'
 *       404:
 *         description: Ingrediente no encontrado
 */
router.put("/:ingredienteId",update);
/**
 * @swagger
 * /{ingredienteId}:
 *   delete:
 *     summary: Elimina un ingrediente por su ID
 *     tags: [Ingredientes]
 *     parameters:
 *       - in: path
 *         name: ingredienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ingrediente a eliminar
 *     responses:
 *       204:
 *         description: Ingrediente eliminado exitosamente
 *       404:
 *         description: Ingrediente no encontrado
 */
router.delete("/:ingredienteId",remove);

/**
 * @swagger
 * components:
 *   schemas:
 *     Ingrediente:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "abc123"
 *         nombre:
 *           type: string
 *           example: "Tomate"
 *         cantidad:
 *           type: number
 *           example: 5
 *         unidad:
 *           type: string
 *           example: "kg"
 *       required:
 *         - id
 *         - nombre
 *     IngredienteInput:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           example: "Tomate"
 *         cantidad:
 *           type: number
 *           example: 5
 *         unidad:
 *           type: string
 *           example: "kg"
 *       required:
 *         - nombre
 */

module.exports = router;