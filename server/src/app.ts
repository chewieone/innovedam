import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { createHealthRouter, type DatabaseHealthProbe } from './routes/healthRouter.js';
import {
  createAuthRouter,
  createInMemoryAuthStore,
  type AuthStore
} from './routes/authRouter.js';
import {
  createDecisionsRouter,
  type DatasetProvider
} from './routes/decisionsRouter.js';

export interface AppDependencies {
  probeDb?: DatabaseHealthProbe;
  authStore?: AuthStore;
  getDataset?: DatasetProvider;
  serveStaticClient?: boolean;
}

const defaultProbeDb: DatabaseHealthProbe = async () => {
  return env.databaseUrl ? 'connected' : 'unconfigured';
};

export function createApp(deps: AppDependencies = {}): express.Express {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  const apiRouter = express.Router();
  apiRouter.use(createHealthRouter(deps.probeDb ?? defaultProbeDb));
  apiRouter.use(createAuthRouter(deps.authStore ?? createInMemoryAuthStore()));
  apiRouter.use(createDecisionsRouter(deps.getDataset ?? (async () => null)));

  app.use('/api/v1', apiRouter);

  if (deps.serveStaticClient) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const clientDist = path.resolve(__dirname, '../../client/dist');
    if (fs.existsSync(clientDist)) {
      app.use(express.static(clientDist));
      app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api/')) {
          next();
          return;
        }
        res.sendFile(path.join(clientDist, 'index.html'));
      });
    }
  }

  app.use(errorHandler);
  return app;
}
