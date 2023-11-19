import { Router } from 'express';
import { checkJwt } from '../middleware/check.middleware.js';
// Importación de controladores
import { loginCtrl, registerCtrl, getUserDataCtrl } from '../controllers/auth.controller.js';

// Importación de middlewares
import { 
    registerValidation, 
    loginValidation, 
    validateRequest 
} from '../middleware/userValidation.middleware.js';
import { logMiddleware } from '../middleware/log.middleware.js';

const router = Router();

/**
 * Ruta para registrar un nuevo usuario.
 * @name /register
 * @method POST
 * @middleware logMiddleware - Registra la solicitud en el log.
 * @middleware registerValidation - Valida los datos de entrada del registro.
 * @middleware validateRequest - Verifica si hay errores en la validación.
 * @function registerCtrl - Controlador para registrar al usuario.
 */
router.post('/register', logMiddleware, registerValidation, validateRequest, registerCtrl);

/**
 * Ruta para iniciar sesión de un usuario.
 * @name /login
 * @method POST
 * @middleware logMiddleware - Registra la solicitud en el log.
 * @middleware loginValidation - Valida los datos de entrada del inicio de sesión.
 * @middleware validateRequest - Verifica si hay errores en la validación.
 * @function loginCtrl - Controlador para iniciar sesión del usuario.
 */
router.post('/login', logMiddleware, loginValidation, validateRequest, loginCtrl);

/**
 * Ruta para obtener datos del usuario autenticado.
 * @name /me
 * @method POST
 * @middleware checkJwt - Verifica el token JWT y añade el ID del usuario a req.userId.
 * @function getUserDataCtrl - Controlador para obtener datos del usuario.
 */
router.post('/me', logMiddleware, checkJwt, getUserDataCtrl);

export default router;

