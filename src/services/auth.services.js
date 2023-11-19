import { pool } from '../config/db.js';
import { encrypt, verified } from '../utils/bcrypt.handle.js';
import { generateToken } from '../utils/jwt.handle.js';
import { BadRequestError } from '../utils/error.handle.js';

/**
 * Registra un nuevo usuario en la base de datos.
 * @param {Object} user - Datos del usuario a registrar.
 * @returns {Promise<Object>} - Datos del usuario registrado.
 * @throws {Error} - Error en caso de que el usuario ya exista o haya algún problema en la inserción.
 */
const registerNewUser = async (user) => {
    const { Nombres, Apellidos, Rut, Correo, Contrasenna, Celular, Fecha_nac, Genero, Foto, ID_rol } = user;

    // Verifica si el usuario ya existe en la base de datos
    const existingUsersQuery = 'SELECT Correo FROM Usuarios WHERE Correo = ?';
    const [existingUsers] = await pool.query(existingUsersQuery, [Correo]);
    if (existingUsers.length > 0) {
        throw new BadRequestError('El usuario ya existe.');
    }

    // Inserta el nuevo usuario en la base de datos
    const passHash = await encrypt(Contrasenna);
    const insertUserQuery = `
        INSERT INTO Usuarios 
            (Nombres, Apellidos, Rut, Correo, Contrasenna, Celular, Fecha_nac, Genero, Foto, ID_rol) 
        VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(insertUserQuery, [Nombres, Apellidos, Rut, Correo, passHash, Celular, Fecha_nac, Genero, Foto, ID_rol]);

    if (!result.insertId) {
        throw new BadRequestError('No se pudo registrar al usuario.');
    }

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
};

/**
 * Inicia sesión de un usuario.
 * @param {Object} credentials - Correo y contraseña del usuario.
 * @returns {Promise<Object>} - Token y datos del usuario.
 * @throws {Error} - Error en caso de credenciales incorrectas.
 */
const loginUser = async ({ Correo, Contrasenna }) => {
    const userQuery = 'SELECT * FROM Usuarios WHERE Correo = ?';
    const [users] = await pool.query(userQuery, [Correo]);

    if (users.length === 0 || !(await verified(Contrasenna, users[0].Contrasenna))) {
        throw new BadRequestError('Credenciales incorrectas.');
    }

    const token = generateToken(users[0].Correo);
    return {
        token,
        user: users[0]
    };
};

/**
 * Obtiene los datos de un usuario específico por su ID.
 * @param {Number} userId - ID del usuario a buscar.
 * @returns {Promise<Object>} - Datos del usuario.
 * @throws {Error} - Error en caso de que el usuario no se encuentre.
 */
const getUserDataByEmail = async (userEmail) => {
    const userQuery = 'SELECT * FROM Usuarios WHERE Correo = ?';
    const [users] = await pool.query(userQuery, [userEmail]);

    if (users.length === 0) {
        throw new BadRequestError('Usuario no encontrado.');
    }

    // Filtrando la información sensible
    const userWithoutPassword = { ...users[0] };
    delete userWithoutPassword.Contrasenna;

    return userWithoutPassword;
};

export { registerNewUser, loginUser, getUserDataByEmail };
