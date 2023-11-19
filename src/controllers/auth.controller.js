import { registerNewUser, loginUser, getUserDataByEmail} from '../services/auth.services.js';

/**
 * Controlador para registrar un nuevo usuario.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {function} next - Función next de Express para pasar al siguiente middleware.
 * @returns {Promise<void>} - Nada.
 */
const registerCtrl = async (req, res, next) => {
    try {
        const responseUser = await registerNewUser(req.body);

        // Filtrando la información sensible (si existe)
        const { Contrasenna, ...userWithoutSensitiveInfo } = responseUser;

        res.status(201).json({
            status: 'success',
            message: 'Usuario registrado exitosamente',
            data: userWithoutSensitiveInfo
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Controlador para iniciar sesión de un usuario.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {function} next - Función next de Express para pasar al siguiente middleware.
 * @returns {Promise<void>} - Nada.
 */
const loginCtrl = async (req, res, next) => {
    try {
        const { Correo, Contrasenna } = req.body;
        const responseUser = await loginUser({ Correo, Contrasenna });
        
        // Filtrando la información sensible
        const userWithoutPassword = { ...responseUser.user };
        delete userWithoutPassword.Contrasenna;

        res.json({
            status: 'success',
            message: 'Inicio de sesión exitoso',
            token: responseUser.token,
            data: userWithoutPassword
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Controlador para obtener datos del usuario autenticado.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {function} next - Función next de Express para pasar al siguiente middleware.
 * @returns {Promise<void>} - Nada.
 */
const getUserDataCtrl = async (req, res, next) => {
    try {
        const userEmail = req.body.Correo;
        const userData = await getUserDataByEmail(userEmail);

        // Filtrando la información sensible
        const userWithoutPassword = { ...userData };
        delete userWithoutPassword.Contrasenna;

        res.json({
            status: 'success',
            data: userWithoutPassword
        });
    } catch (error) {
        next(error);
    }
};

export { loginCtrl, registerCtrl, getUserDataCtrl };
