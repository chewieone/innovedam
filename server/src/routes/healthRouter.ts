import { Router } from 'express';
import type { HealthResponse } from '@innovedam/shared';

export type DatabaseHealthProbe = () => Promise<'connected' | 'disconnected' | 'unconfigured'>;

export function createHealthRouter(probeDb: DatabaseHealthProbe): Router {
  const router = Router();

  router.get('/health', async (_req, res) => {
    const database = await probeDb();
    const payload: HealthResponse = {
      status: database === 'disconnected' ? 'degraded' : 'ok',
      service: 'innovedam-api',
      database,
      timestamp: new Date().toISOString()
    };
    res.status(200).json(payload);
  });

  return router;
}
