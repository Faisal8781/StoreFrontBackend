import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const validateTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.get('Authorization');
    if (authHeader) {
      const bearer = authHeader.split(' ')[0].toLowerCase();

      const token = authHeader.split(' ')[1];

      if (token && bearer === 'bearer') {
        const decode = jwt.verify(token, process.env.TOKEN_SECRET as string);

        if (decode) {
          next();
        } else {
          throw new Error('Failed to auth User');
        }
      } else {
        throw new Error('Error Login');
      }
    } else {
      // No token provided
      throw new Error('Error Login');
    }
  } catch (err) {
    throw new Error('Login Error: Please try again');
  }
};

export default validateTokenMiddleware;
