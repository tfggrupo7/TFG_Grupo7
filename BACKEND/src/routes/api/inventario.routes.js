const router = require('express').Router();

const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../../controllers/inventario.controller");

/**
 * @swagger
 * /:
 *   get:
 *     summary: Obtiene todos los inventarios
 *     tags: [Inventario]
 *     responses:
 *       200:
 *         description: Lista de inventarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inventario'
 */
router.get("/", getAll);
/**
 * @swagger
 * /{inventarioId}:
 *   get:
 *     summary: Obtiene un inventario por su ID
 *     tags: [Inventario]
 *     parameters:
 *       - in: path
 *         name: inventarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del inventario
 *     responses:
 *       200:
 *         description: Inventario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventario'
 *       404:
 *         description: Inventario no encontrado
 */
router.get("/:inventarioId", getById);
/**
 * @swagger
 * /:
 *   post:
 *     summary: Crea un nuevo inventario
 *     tags: [Inventario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventarioInput'
 *     responses:
 *       201:
 *         description: Inventario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventario'
 */
router.post("/", create);
/**
 * @swagger
 * /{inventarioId}:
 *   put:
 *     summary: Actualiza un inventario por su ID
 *     tags: [Inventario]
 *     parameters:
 *       - in: path
 *         name: inventarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del inventario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventarioInput'
 *     responses:
 *       200:
 *         description: Inventario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventario'
 *       404:
 *         description: Inventario no encontrado
 */
router.put("/:inventarioId",update);
/**
 * @swagger
 * /{inventarioId}:
 *   delete:
 *     summary: Elimina un inventario por su ID
 *     tags: [Inventario]
 *     parameters:
 *       - in: path
 *         name: inventarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del inventario a eliminar
 *     responses:
 *       204:
 *         description: Inventario eliminado exitosamente
 *       404:
 *         description: Inventario no encontrado
 */
router.delete("/:inventarioId",remove);

/**
 * @swagger
 * components:
 *   schemas:
 *     Inventario:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "inv123"
 *         nombre:
 *           type: string
 *           example: "Inventario Principal"
 *         cantidad:
 *           type: number
 *           example: 100
 *         ubicacion:
 *           type: string
 *           example: "Almacén Central"
 *       required:
 *         - id
 *         - nombre
 *     InventarioInput:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           example: "Inventario Principal"
 *         cantidad:
 *           type: number
 *           example: 100
 *         ubicacion:
 *           type: string
 *           example: "Almacén Central"
 *       required:
 *         - nombre
 */
module.exports = router;