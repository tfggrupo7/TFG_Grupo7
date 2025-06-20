const router = require('express').Router();

const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../../controllers/roles.controller");

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Gestión de roles
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Rol:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: Administrador
 */
/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Obtiene todos los roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rol'
 */
router.get("/", getAll);
/**
 * @swagger
 * /roles/{rolId}:
 *   get:
 *     summary: Obtiene un rol por ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: rolId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a obtener
 *     responses:
 *       200:
 *         description: Rol encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rol'
 */
router.get("/:rolId", getById);
/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Crea un nuevo rol
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Administrador
 *     responses:
 *       201:
 *         description: Rol creado exitosamente
 */
router.post("/", create);
/**
 * @swagger
 * /roles/{rolId}:
 *   put:
 *     summary: Actualiza un rol existente
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: rolId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Editor
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 */
router.put("/:rolId",update);
/**
 * @swagger
 * /roles/{rolId}:
 *   delete:
 *     summary: Elimina un rol por ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: rolId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a eliminar
 *     responses:
 *       204:
 *         description: Rol eliminado exitosamente
 */
router.delete("/:rolId",remove);

module.exports = router;