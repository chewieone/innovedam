import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { LoginRequestSchema, RegisterRequestSchema } from '@innovedam/shared';
import { env } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import { requireAuth, signAuthToken } from '../middleware/authMiddleware.js';

export interface AuthUserRecord {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  clearance: 'Internal' | 'Confidential';
  companyId?: string;
  employeeId?: string;
}

export interface AuthStore {
  findByEmail(email: string): Promise<AuthUserRecord | null>;
  findById(id: string): Promise<AuthUserRecord | null>;
  createUser(input: {
    email: string;
    fullName: string;
    passwordHash: string;
  }): Promise<AuthUserRecord>;
}

export function createInMemoryAuthStore(seedUsers: AuthUserRecord[] = []): AuthStore {
  const users = new Map<string, AuthUserRecord>();
  for (const u of seedUsers) {
    users.set(u.email.toLowerCase(), u);
  }

  return {
    async findByEmail(email) {
      return users.get(email.toLowerCase()) ?? null;
    },
    async findById(id) {
      for (const user of users.values()) {
        if (user.id === id) return user;
      }
      return null;
    },
    async createUser(input) {
      const id = `usr_${users.size + 1}`;
      const created: AuthUserRecord = {
        id,
        email: input.email.toLowerCase(),
        fullName: input.fullName,
        passwordHash: input.passwordHash,
        clearance: 'Internal'
      };
      users.set(created.email, created);
      return created;
    }
  };
}

export function createAuthRouter(store: AuthStore): Router {
  const router = Router();

  router.post('/auth/register', async (req, res, next) => {
    try {
      const parsed = RegisterRequestSchema.parse(req.body);
      const existing = await store.findByEmail(parsed.email);
      if (existing) {
        throw new AppError(409, 'EMAIL_EXISTS', 'An account with this email already exists');
      }

      const passwordHash = await bcrypt.hash(parsed.password, 10);
      const user = await store.createUser({
        email: parsed.email,
        fullName: parsed.fullName,
        passwordHash
      });

      const token = signAuthToken({
        userId: user.id,
        email: user.email,
        clearance: user.clearance,
        companyId: user.companyId,
        employeeId: user.employeeId
      });

      res.cookie(env.cookieName, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: env.cookieSecure
      });

      res.status(201).json({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        clearance: user.clearance
      });
    } catch (err) {
      next(err);
    }
  });

  router.post('/auth/login', async (req, res, next) => {
    try {
      const parsed = LoginRequestSchema.parse(req.body);
      const user = await store.findByEmail(parsed.email);
      if (!user) {
        throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
      }

      const valid = await bcrypt.compare(parsed.password, user.passwordHash);
      if (!valid) {
        throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
      }

      const token = signAuthToken({
        userId: user.id,
        email: user.email,
        clearance: user.clearance,
        companyId: user.companyId,
        employeeId: user.employeeId
      });

      res.cookie(env.cookieName, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: env.cookieSecure
      });

      res.status(200).json({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        clearance: user.clearance
      });
    } catch (err) {
      next(err);
    }
  });

  router.post('/auth/logout', (_req, res) => {
    res.clearCookie(env.cookieName);
    res.status(200).json({ loggedOut: true });
  });

  router.get('/auth/me', requireAuth, async (req, res, next) => {
    try {
      const user = await store.findById(req.authUser!.userId);
      if (!user) {
        throw new AppError(401, 'UNAUTHENTICATED', 'User session is no longer valid');
      }

      res.status(200).json({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        clearance: user.clearance,
        companyId: user.companyId ?? null,
        employeeId: user.employeeId ?? null
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
