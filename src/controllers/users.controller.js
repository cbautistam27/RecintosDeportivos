import { validationResult } from 'express-validator';
import { getAll, getById, add, update, remove } from '../services/users.services.js';
import { BadRequestError, NotFoundError } from '../utils/error.handle.js';

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await getAll();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const user = await getById(req.params.id);
        if (!user) {
            throw new NotFoundError('Usuario no encontrado');
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new BadRequestError(errors.array().map(error => error.msg).join(', ')));
    }
    
    try {
        const newUser = await add(req.body);
        res.status(201).json({
            status: 'success',
            message: 'Usuario creado exitosamente por el Administrador',
            data: newUser
        });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new BadRequestError(errors.array().map(error => error.msg).join(', ')));
    }

    try {
        const updatedUser = await update(req.params.id, req.body);
        if (!updatedUser) {
            throw new BadRequestError('Actualización fallida');
        }
        res.status(200).json({
            status: 'success',
            message: 'Usuario actualizado exitosamente',
            data: updatedUser
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const result = await remove(req.params.id);
        if (!result) {
            throw new BadRequestError('Eliminación fallida');
        }
        res.status(200).json({
            status: 'success',
            message: 'Usuario eliminado con éxito'
        });
    } catch (error) {
        next(error);
    }
};
