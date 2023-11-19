import { Router } from 'express';
import { logMiddleware } from '../middleware/log.middleware.js';
import { checkJwt } from '../middleware/check.middleware.js';
import { getAllUsers } from '../controllers/users.controller.js';

const router = Router();

router.get('/inicio', logMiddleware, checkJwt, getAllUsers);

export default router;