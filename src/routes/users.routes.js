import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/users.controller.js';
import { checkJwt } from '../middleware/check.middleware.js';
import { logMiddleware } from '../middleware/log.middleware.js';
import { registerValidation } from '../middleware/userValidation.middleware.js';

const router = Router();

// Rutas de usuario
router.get('/empleados', logMiddleware, checkJwt, getAllUsers);
router.get('/empleado/:id', logMiddleware, checkJwt, getUserById);
router.post('/empleado', logMiddleware, checkJwt, registerValidation, createUser);
router.put('/empleado/:id', logMiddleware, checkJwt, registerValidation, updateUser);
router.delete('/empleado/:id', logMiddleware, checkJwt, deleteUser);

export default router;
