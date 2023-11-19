import dotenv from 'dotenv';
dotenv.config();

// Importaciones de módulos necesarios
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { pool } from './config/db.js';
import morgan from 'morgan';
import routes from './routes/index.routes.js';
import cors from 'cors';
import { errorHandler, AppError } from './utils/error.handle.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware Configuration
app.use(morgan('combined'));

// Configuración de CORS
app.use(cors({
    origin: ['http://localhost:3000', 'https://interfazrecintosdeportivos-production.up.railway.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para analizar solicitudes con payloads JSON
app.use(express.json());

// Montaje de las rutas API
app.use('/api', routes);

// Middleware para manejo de errores
app.use(errorHandler);

// Crear un servidor HTTP a partir de la aplicación Express
const server = http.createServer(app);

// Inicializar Socket.io con el servidor HTTP
const io = new SocketIOServer(server);

export { io };

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');
    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado');
    });
    // Puedes definir más eventos de socket.io aquí
});

// Función para inicializar conexión con la base de datos
const initializeDatabaseConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conexion exitosa a la base de datos');
        connection.release();
    } catch (error) {
        if (process.env.NODE_ENV === 'production') {
            console.error('Error al conectar a la base de datos');
            throw new AppError('Error de servidor', 500);
        } else {
            console.error('Error al conectar a la base de datos:', error);
            throw error;
        }
    }
};

// Función para iniciar el servidor
const startServer = () => {
    server.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
};

// Función anónima autoejecutable para iniciar la aplicación
(async () => {
    try {
        await initializeDatabaseConnection();
        startServer();
    } catch (error) {
        console.error('Error al iniciar la aplicación:', error);
    }
})();
