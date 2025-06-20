const router = require("express").Router();

const {
  getAll,
  getById,
  getEmpleadosAndTarea,
  create,
  update,
  remove,
  getEmpleadosYRoles,login, recuperarContraseña,restablecerContraseña,
  updateEmpleado,
  cambiarContraseña
} = require("../../controllers/empleado.controller");
const { checkToken } = require("../../middleware/auth.middleware");


const { checkempleadosId, checkdataEmpleado, checkdataEmpleadoUpdate} = require("../../middleware/empleados.middleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Empleado:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nombre:
 *           type: string
 *         email:
 *           type: string
 *         telefono:
 *           type: string
 *         rol_id:
 *           type: integer
 *         salario:
 *           type: number
 *         status:
 *           type: string
 *         activo:
 *           type: boolean
 *         fecha_inicio:
 *           type: string
 *           format: date
 *         usuario_id:
 *           type: integer
 */

/**
 * @swagger
 * /empleados:
 *   get:
 *     summary: Obtiene todos los empleados
 *     tags: [Empleados]
 *     responses:
 *       200:
 *         description: Lista de empleados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empleado'
 */
router.get("/", getAll);
/**
 * @swagger
 * /empleados/tareas:
 *   get:
 *     summary: Obtiene empleados y sus tareas
 *     tags: [Empleados]
 *     responses:
 *       200:
 *         description: Lista de empleados con sus tareas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   empleado:
 *                     $ref: '#/components/schemas/Empleado'
 *                   tareas:
 *                     type: array
 *                     items:
 *                       type: string
 */
router.get("/tareas", checkToken,getEmpleadosAndTarea);
/**
 * @swagger
 * /empleados/role:
 *   get:
 *     summary: Obtiene empleados y sus roles
 *     tags: [Empleados]
 *     responses:
 *       200:
 *         description: Lista de empleados con sus roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   empleado:
 *                     $ref: '#/components/schemas/Empleado'
 *                   rol:
 *                     type: string
 */
router.get('/role', checkToken, getEmpleadosYRoles); 
/**
 * @swagger
 * /empleados/{empleadoId}:
 *   get:
 *     summary: Obtiene un empleado por su ID
 *     tags: [Empleados]
 *     parameters:
 *       - in: path
 *         name: empleadoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: Detalles del empleado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empleado'
 */
router.get("/:empleadoId", checkToken, checkempleadosId, getById);
/**
 * @swagger
 * /empleados:
 *   post:
 *     summary: Crea un nuevo empleado
 *     tags: [Empleados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Empleado'
 *     responses:
 *       201:
 *         description: Empleado creado exitosamente
 */
router.post("/", checkToken, checkdataEmpleado,create);
/**
 * @swagger
 * /empleados/login:
 *   post:
 *     summary: Inicia sesión de un empleado
 *     tags: [Empleados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 */
router.post('/login', login);
/**
 * @swagger
 * /empleados/recuperar-contrasena:
 *   post:
 *     summary: Recupera la contraseña de un empleado
 *     tags: [Empleados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Correo de recuperación enviado exitosamente
 */
router.post('/recuperar-contrasena', recuperarContraseña);
/**
 * @swagger
 * /empleados/restablecer-contrasena/{token}:
 *   post:
 *     summary: Restablece la contraseña de un empleado
 *     tags: [Empleados]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de restablecimiento de contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña restablecida exitosamente
 */
router.post('/restablecer-contrasena/:token',restablecerContraseña);
/**
 * @swagger
 * /empleados/cambiar-contrasena/{empleadoId}:
 *   post:
 *     summary: Cambia la contraseña de un empleado
 *     tags: [Empleados]
 *     parameters:
 *       - in: path
 *         name: empleadoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 */
router.post('/cambiar-contrasena/:empleadoId',checkempleadosId, cambiarContraseña)
/**
 * @swagger
 * /empleados/{empleadoId}:
 *   put:
 *     summary: Actualiza un empleado por su ID
 *     tags: [Empleados]
 *     parameters:
 *       - in: path
 *         name: empleadoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Empleado'
 *     responses:
 *       200:
 *         description: Empleado actualizado exitosamente
 */
router.put('/updateEmpleado/:empleadoId', checkToken, checkempleadosId, checkdataEmpleadoUpdate, updateEmpleado);
  /**
 * @swagger
 * /empleados/{empleadoId}:
 *   put:
 *     summary: Actualiza un empleado por su ID
 *     tags: [Empleados]
 *     parameters:
 *       - in: path
 *         name: empleadoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Empleado'
 *     responses:
 *       200:
 *         description: Empleado actualizado exitosamente
 */
router.put("/:empleadoId",checkToken, checkdataEmpleado, checkempleadosId, update);
/**
 * @swagger
 * /empleados/{empleadoId}:
 *   delete:
 *     summary: Elimina un empleado por su ID
 *     tags: [Empleados]
 *     parameters:
 *       - in: path
 *         name: empleadoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: Empleado eliminado exitosamente
 */
router.delete("/:empleadoId",checkToken, checkempleadosId, remove);

module.exports = router;
