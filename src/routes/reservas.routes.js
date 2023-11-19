import { Router } from 'express';
import { logMiddleware } from '../middleware/log.middleware.js';
import { checkJwt } from '../middleware/check.middleware.js';
import { getAllReservations_ctrl, addReservaCtrl, deleteReservaCtrl, updateReservaCtrl, getReservaByIdCtrl } from '../controllers/reservas.controller.js';

const router = Router();

router.get('/calendario', logMiddleware, checkJwt, getAllReservations_ctrl);
router.get('/reserva/:id', logMiddleware, checkJwt, getReservaByIdCtrl);
router.post('/addReserva', logMiddleware, checkJwt, addReservaCtrl);
router.put('/updateReserva/:id', logMiddleware, checkJwt, updateReservaCtrl);
router.delete('/deleteReserva/:id', logMiddleware, checkJwt, deleteReservaCtrl);

export default router;