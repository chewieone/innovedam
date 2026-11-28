import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { Clearance } from '@innovedam/shared';
import { env } from '../config/env.js';
import { AppError } from './errorHandler.js';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  clearance?: Clearance;
  companyId?: string;
  employeeId?: string;
}

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthTokenPayload;
    }
  }
}

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn']
  });
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.[env.cookieName] as string | undefined;
  if (!token) {
    next(new AppError(401, 'UNAUTHENTICATED', 'Authentication required'));
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
    req.authUser = decoded;
    next();
  } catch {
    next(new AppError(401, 'INVALID_TOKEN', 'Session token is invalid or expired'));
  }
}
