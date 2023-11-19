import { pool } from '../config/db.js';
import { InternalServerError } from '../utils/error.handle.js';

export const getAllReservations = async () => {
    try {
        const query = 'SELECT * FROM Reserva WHERE Semana_id_semana = 46';
        const [reservas] = await pool.query(query);
        return reservas;
    } catch (error) {
        throw new InternalServerError('Error al obtener reservas de la semana 3.');
    }
};
export const addReserva = async ({ Usuarios_ID_usuario, Semana_id_semana, Recinto_id_recinto, Bloque_horario_id_bloque, actividad, carrera }) => {
    try {
        const query = 'INSERT INTO Reserva (Usuarios_ID_usuario, Semana_id_semana, Recinto_id_recinto, Bloque_horario_id_bloque, actividad, carrera) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await pool.query(query, [Usuarios_ID_usuario, Semana_id_semana, Recinto_id_recinto, Bloque_horario_id_bloque, actividad, carrera]);
        return {
            id: result.insertId,
            Usuarios_ID_usuario,
            Semana_id_semana,
            Recinto_id_recinto,
            Bloque_horario_id_bloque,
            actividad,
            carrera
        };
    } catch (error) {
        throw new InternalServerError('Error al agregar reserva.');
    }
};

export const getReservaById = async (id_reserva) => {
    try {
        const [reservation] = await pool.query('SELECT * FROM Reserva WHERE id_reserva = ?', [id_reserva]);
        if (reservation.length === 0) throw new NotFoundError('Reserva no encontrada');
        return reservation[0];
    } catch (error) {
        throw new InternalServerError('Error al obtener la reserva por ID.');
    }
};

export const updateReserva = async (id_reserva, reservationData) => {
    try {
        const reservation = await getReservaById(id_reserva);
        const { actividad, carrera } = reservationData;
        const query = `UPDATE Reserva SET activadad = ?, carrera = ? WHERE id_reserva = ?`;
        await pool.query(query, [actividad, carrera, id_reserva]);
        return {
            id: id_reserva,
            actividad,
            carrera
        };
    } catch (error) {
        throw new InternalServerError('Error al actualizar la reserva.');
    }
};

export const deleteReserva = async(id_reserva) => {
    try{
        const user = await getReservaById(id_reserva);
        const query = 'DELETE FROM Reserva WHERE id_reserva = ?';
        const [result] = await pool.query(query, [id_reserva]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new InternalServerError('Error al eliminar la reserva.');
    }
};