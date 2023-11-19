import morgan from 'morgan';
import { pool } from '../config/db.js';

// Personalizar el formato de Morgan para capturar la información que necesitas
morgan.token('user-agent', (req) => req.headers['user-agent']);
morgan.token('response-time', (req, res, digits) => {
    const start = req._startAt || [0, 0];
    const diff = process.hrtime(start);
    const time = diff[0] * 1e3 + diff[1] * 1e-6;
    return time.toFixed(digits);
});

const morganFormat = ':method :url :status :response-time ms - :user-agent';

export const logMiddleware = morgan(morganFormat, {
    immediate: false,
    stream: {
        write: async (message) => {
            const [method, url, status, responseTime, userAgent] = message.split(' ');
            const logLevel = parseInt(status, 10) >= 400 ? "ERROR" : "INFO";

            try {
                const query = `
                    INSERT INTO RegistroHTTP 
                        (MetodoSolicitud, URLSolicitud, AgenteUsuario, NivelLog, MensajeError, StatusHTTP, TiempoRespuesta) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;
                await pool.query(query, [method, url, userAgent, logLevel, "", status, parseFloat(responseTime)]);
            } catch (error) {
                console.error("Error al insertar log en la base de datos:", error);
            }
        }
    }
});
