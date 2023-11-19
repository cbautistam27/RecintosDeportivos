import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
import { AppError } from './error.handle.js';

const { sign, verify } = jwt;

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (id) => {
  try {
    const token = sign({ id }, JWT_SECRET, {
      expiresIn: '2h'
    });
    return token;
  } catch (error) {
    throw new AppError('Error generating token', 500);
  }
}

const verifyToken = (token) => {
  try {
    const isOk = verify(token, JWT_SECRET);
    return isOk;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token has expired', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token', 401);
    }
    throw new AppError('Error verifying token', 500);
  }
}

export { generateToken, verifyToken };