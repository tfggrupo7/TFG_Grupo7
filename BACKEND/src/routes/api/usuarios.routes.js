const router = require('express').Router();
const { registro, getByUsuarioId,login, perfil, recuperarContraseña, restablecerContraseña, actualizarDatos, cambiarContraseña , eliminarUsuario} = require('../../controllers/usuarios.controller');
const { checkToken } = require('../../middleware/auth.middleware');


router.get('/:usuarioId', getByUsuarioId);

/**
 * @swagger
 * /usuarios/registro:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Autenticación y Perfil]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post('/registro', registro);
/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Inicia sesión de un usuario
 *     tags: [Autenticación y Perfil]
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
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', login);
/**
 * @swagger
 * /usuarios:
 *   put:
 *     summary: Actualiza los datos del usuario autenticado
 *     tags: [Autenticación y Perfil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Datos actualizados exitosamente
 *       400:
 *         description: Error en la solicitud
 */
/**
 * @swagger
 * /usuarios/recuperar-contrasena:
 *   post:
 *     summary: Inicia el proceso de recuperación de contraseña
 *     tags: [Autenticación y Perfil]
 *     responses:
 *       200:
 *         description: Proceso de recuperación iniciado
 *       400:
 *         description: Error en la solicitud
 */
router.post('/recuperar-contrasena',recuperarContraseña);
/**
 * @swagger
 * /usuarios/restablecer-contrasena/{token}:
 *   post:
 *     summary: Restablece la contraseña del usuario usando un token
 *     tags: [Autenticación y Perfil]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de restablecimiento de contraseña
 *     responses:
 *       200:
 *         description: Contraseña restablecida exitosamente
 *       400:
 *         description: Error en el token o solicitud
 */
router.post('/restablecer-contrasena/:token',restablecerContraseña);

router.use(checkToken);

/**
 * @swagger
 * tags:
 *   name: Autenticación y Perfil
 *   description: Endpoints para autenticación, recuperación de contraseña y gestión de perfil de usuario
 */

/**
 * @swagger
 * /usuarios/perfil:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado
 *     tags: [Autenticación y Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado
 */
router.get('/perfil', perfil);

/**
 * @swagger
 * /usuarios/cambiar-contrasena/{token}:
 *   post:
 *     summary: Cambia la contraseña del usuario autenticado
 *     tags: [Autenticación y Perfil]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de autenticación del usuario
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 *       400:
 *         description: Error en la solicitud o token inválido
 */
router.post('/cambiar-contrasena/:token', cambiarContraseña); 
/**
 * @swagger
 * /:
 *   put:
 *     summary: Actualiza los datos del usuario autenticado
 *     tags: [Autenticación y Perfil]
 *     requestBody:
 *       description: Datos para actualizar el usuario
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan Pérez"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan.perez@example.com"
 *               
 *     responses:
 *       200:
 *         description: Datos actualizados exitosamente
 *       400:
 *         description: Error en la solicitud o datos inválidos
 */
router.put('/',actualizarDatos);
/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario por ID
 *     tags: [Autenticación y Perfil]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/:id', eliminarUsuario); 
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