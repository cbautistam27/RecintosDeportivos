import { getAllReservations, addReserva, deleteReserva, updateReserva, getReservaById } from '../services/reservas.services.js';
import { io } from '../app.js';

export const getAllReservations_ctrl = async (req, res, next) => {
    try {
        const users = await getAllReservations();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const addReservaCtrl = async (req, res, next) => {
    try{
        const { Usuarios_ID_usuario, Semana_id_semana, Recinto_id_recinto, Bloque_horario_id_bloque, actividad, carrera } = req.body;
        const responseUser = await addReserva({ Usuarios_ID_usuario, Semana_id_semana, Recinto_id_recinto, Bloque_horario_id_bloque, actividad, carrera });

        res.json({
            status: 'success',
            message: 'Reserva agregada exitosamente',
            data: responseUser
        });

        io.emit('new-reservation', responseUser);
    } catch (error) {
        next(error);
    }
}

export const getReservaByIdCtrl = async (req, res, next) => {
    try {
        const reservation = await getReservaById(req.params.id);
        if (!reservation) {
            throw new NotFoundError('Reserva no encontrada');
        };
        res.status(200).json(reservation);
    } catch (error) {
        next(error);
    }
};

export const updateReservaCtrl = async (req, res, next) => {
    try {
        const updatedUser = await updateReserva(req.params.id, req.body);
        if (!updatedUser) {
            throw new BadRequestError('Actualización fallida');
        };
        res.status(200).json({
            status: 'success',
            message: 'Reserva actualizada exitosamente',
            data: updatedUser
        });
    } catch (error) {
        next(error);
    }
};

export const deleteReservaCtrl = async (req, res, next) => {
    try {
        const result = await deleteReserva(req.params.id);
        if (!result) {
            throw new BadRequestError('Eliminación fallida');
        }
        res.status(200).json({
            status: 'success',
            message: 'Reserva eliminada con éxito'
        });
    } catch (error) {
        next(error);
    }
};