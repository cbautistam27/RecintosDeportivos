import bcrypt from 'bcryptjs';
import { AppError } from './error.handle.js';

const { hash, compare } = bcrypt;

const encrypt = async (pass) => {
    try {
        const passwordHash = await hash(pass, 8);
        return passwordHash;
    } catch (error) {
        throw new AppError('Error encrypting password', 500);
    }
}

const verified = async (pass, passHash) => {
    try {
        const isCorrect = await compare(pass, passHash);
        return isCorrect;
    } catch (error) {
        throw new AppError('Error verifying password', 500);
    }
}

export { encrypt, verified };