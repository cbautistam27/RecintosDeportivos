import { verifyToken } from '../utils/jwt.handle.js';
import { UnauthorizedError } from '../utils/error.handle.js';

export const checkJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return next(new UnauthorizedError('Authentication required'));
    }

    // Verificar el formato "Bearer [token]"
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return next(new UnauthorizedError('Authentication required'));
    }

    const token = tokenParts[1];

    try {
        const decodedToken = verifyToken(token);
        if (!decodedToken) {
            throw new UnauthorizedError('Authentication required');
        }

        req.user = decodedToken;
        next();
    } catch (e) {
        next(new UnauthorizedError('Authentication required'));
    }
}
