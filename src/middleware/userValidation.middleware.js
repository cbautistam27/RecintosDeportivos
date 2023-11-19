import { body } from 'express-validator';
import { validationResult } from 'express-validator';
import { BadRequestError } from '../utils/error.handle.js';

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new BadRequestError(errors.array()[0].msg));
    }
    next();
};

// Validation for user registration
export const registerValidation = [
    body('Nombres')
        .notEmpty()
        .withMessage('El nombre es obligatorio.')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 45 caracteres.'),
    body('Apellidos')
        .notEmpty()
        .withMessage('Los apellidos son obligatorios.')
        .isLength({ min: 2, max: 100 })
        .withMessage('Los apellidos deben tener entre 2 y 45 caracteres.'),
    body('Rut')
        .notEmpty()
        .withMessage('El RUT es obligatorio.')
        .isLength({ min: 9, max: 10 })
        .withMessage('El RUT debe tener entre 9 y 10 caracteres.'),
    body('Correo')
        .notEmpty()
        .withMessage('El correo es obligatorio.')
        .isEmail()
        .withMessage('Debe ser un correo válido.'),
    body('Contrasenna')
        .notEmpty()
        .withMessage('La contraseña es obligatoria.')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres.'),
    body('Celular')
        .optional()
        .isLength({ min: 9, max: 10 })
        .withMessage('El celular debe tener entre 9 y 10 números.'),
    body('Fecha_nac')
        .notEmpty()
        .withMessage('La fecha de nacimiento es obligatoria.')
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage('Debe ser una fecha válida en formato YYYY-MM-DD.'),
    body('Genero')
        .notEmpty()
        .withMessage('El género es obligatorio.')
        .isIn(['Masculino', 'Femenino', 'Otro'])  // Asumiendo posibles valores
        .withMessage('El género debe ser Masculino, Femenino u Otro.'),
    body('Foto')
        .optional()
        .isURL()
        .withMessage('Debe ser una URL válida para la foto.'),
    // Asumiendo que 'ID_rol' es obligatorio y es un número entero
    body('ID_rol')
        .notEmpty()
        .withMessage('ID_rol es obligatorio.')
        .isInt()
        .withMessage('ID_rol debe ser un número entero.')
];

// Validation for user login
export const loginValidation = [
    body('Correo')
        .notEmpty()
        .withMessage('El correo es obligatorio.')
        .isEmail()
        .withMessage('Debe ser un correo válido.'),
    body('Contrasenna')
        .notEmpty()
        .withMessage('La contraseña es obligatoria.')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres.')
];