import { pool } from '../config/db.js';
import { BadRequestError, NotFoundError, InternalServerError } from '../utils/error.handle.js';
import { encrypt } from '../utils/bcrypt.handle.js';  // Importando las funciones de bcrypt

export const getAll = async () => {
    try {
        const [users] = await pool.query('SELECT * FROM Usuarios');
        return users;
    } catch (error) {
        throw new InternalServerError('Error al obtener usuarios.');
    }
};

export const getById = async (id) => {
    try {
        const [users] = await pool.query('SELECT * FROM Usuarios WHERE ID_usuario = ?', [id]);
        if (users.length === 0) throw new NotFoundError('Usuario no encontrado');
        return users[0];
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new InternalServerError('Error al obtener el usuario por ID.');
    }
};

export const add = async (userData) => {
    try {
        const { Nombres, Apellidos, Rut, Correo, Contrasenna, Celular, Fecha_nac, Genero, Foto, ID_rol } = userData;
        
        const [existingUsers] = await pool.query('SELECT Correo FROM Usuarios WHERE Correo = ?', [Correo]);
        if (existingUsers.length > 0) throw new BadRequestError('El usuario ya existe.');

        const passHash = await encrypt(Contrasenna);
        const query = `
            INSERT INTO Usuarios 
                (Nombres, Apellidos, Rut, Correo, Contrasenna, Celular, Fecha_nac, Genero, Foto, ID_rol) 
            VALUES 
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(query, [Nombres, Apellidos, Rut, Correo, passHash, Celular, Fecha_nac, Genero, Foto, ID_rol]);
        
        if (!result.insertId) throw new BadRequestError('No se pudo registrar al usuario.');

        return {
            id: result.insertId,
            Correo,
            Nombres,
            Apellidos,
            Rut,
            Celular,
            Fecha_nac,
            Genero,
            Foto,
            ID_rol
        };
        
    } catch (error) {
        throw error;
    }
};

export const update = async (ID_usuario, userData) => {
    try {
        const user = await getById(ID_usuario);  
        const { Nombres, Apellidos, Rut, Correo, Contrasenna, Celular, Fecha_nac, Genero, Foto, ID_rol } = userData;
        
        const passHash = await encrypt(Contrasenna);
        
        const query = `
            UPDATE Usuarios 
            SET Nombres = ?, Apellidos = ?, Rut = ?, Correo = ?, Contrasenna = ?, Celular = ?, Fecha_nac = ?, Genero = ?, Foto = ?, ID_rol = ?
            WHERE ID_usuario = ?
        `;
        
        await pool.query(query, [Nombres, Apellidos, Rut, Correo, passHash, Celular, Fecha_nac, Genero, Foto, ID_rol, ID_usuario]);
        
        return {
            ID_usuario,
            Nombres,
            Apellidos,
            Rut,
            Correo,
            Celular,
            Fecha_nac,
            Genero,
            Foto,
            ID_rol
        };
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof BadRequestError) {
            throw error;
        }
        throw new InternalServerError('Error al actualizar usuario.');
    }
};


export const remove = async (ID_usuario) => {
    try {
        const user = await getById(ID_usuario);  
        
        const query = `
            DELETE FROM Usuarios 
            WHERE ID_usuario = ?
        `;
        
        const [result] = await pool.query(query, [ID_usuario]);
        
        return result.affectedRows > 0;
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new InternalServerError('Error al eliminar usuario.');
    }
};