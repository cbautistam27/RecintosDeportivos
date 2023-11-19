import dotenv from 'dotenv';
dotenv.config();

import { createPool } from 'mysql2/promise';
import { AppError } from '../utils/error.handle.js';

/**
 * Configuración de la base de datos a partir de las variables de entorno.
 * @type {Object}
 */
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

/**
 * Pool de conexiones a la base de datos utilizando mysql2/promise.
 * @type {import('mysql2/promise').Pool}
 */
const pool = createPool(dbConfig);

/**
 * Función para testear y establecer la conexión a la base de datos.
 * Si hay un error durante la conexión, se manejará y se mostrará un mensaje correspondiente.
 * En un entorno de producción, los detalles del error se ocultan por razones de seguridad.
 */
pool.getConnection((err, connection) => {
    if (err) {
        let errorMsg = 'Error en la conexión a la base de datos';
        
        if (process.env.NODE_ENV !== 'production') {
            switch (err.code) {
                case 'PROTOCOL_CONNECTION_LOST':
                    errorMsg = 'La conexión a la base de datos fue cerrada.';
                    break;
                case 'ER_CON_COUNT_ERROR':
                    errorMsg = 'La base de datos tiene demasiadas conexiones.';
                    break;
                case 'ECONNREFUSED':
                    errorMsg = 'La conexión a la base de datos fue rechazada.';
                    break;
                default:
                    errorMsg = err.message;
                    break;
            }
        }

        console.error(errorMsg);
        throw new AppError(errorMsg, 500);
    }

    // Si la conexión es exitosa, se libera de inmediato para ser reutilizada por el pool.
    if (connection) connection.release();
    return;
});

export { pool };