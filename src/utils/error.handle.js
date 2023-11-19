import winston from 'winston';

/**
 * Configuración básica para winston
 * @type {winston.Logger}
 */
const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'api-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log' }),
        new winston.transports.Console({ format: winston.format.simple() })
    ],
});

/**
 * Clase base para manejar errores personalizados
 * @extends {Error}
 */
class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends AppError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

class NotFoundError extends AppError {
    constructor(message = "Not Found") {
        super(message, 404);
    }
}

class ConflictError extends AppError {
    constructor(message = "Conflict") {
        super(message, 409);
    }
}

class InternalServerError extends AppError {
    constructor(message = "Internal Server Error") {
        super(message, 500, false);
    }
}

const errorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        handleProductionError(err, req, res);
    } else {
        handleDevelopmentError(err, req, res);
    }
};

const handleProductionError = (err, req, res) => {
    const errorDetails = {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
    };
    logger.error(errorDetails);
    if (err.isOperational) {
        res.status(err.statusCode).json({ message: err.message });
    } else {
        res.status(500).json({ message: 'Ocurrió un error interno. Intente nuevamente más tarde.' });
    }
};

const handleDevelopmentError = (err, req, res) => {
    const errorDetails = {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
    };
    res.status(err.statusCode || 500).json(errorDetails);
};

export { 
    AppError, 
    BadRequestError, 
    UnauthorizedError, 
    NotFoundError, 
    ConflictError, 
    InternalServerError, 
    errorHandler 
};
