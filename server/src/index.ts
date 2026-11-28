import { PrismaClient } from '@prisma/client';
import { createApp } from './app.js';
import { env } from './config/env.js';

const prisma = env.databaseUrl ? new PrismaClient() : null;

const app = createApp({
  serveStaticClient: env.nodeEnv === 'production',
  probeDb: async () => {
    if (!prisma) return 'unconfigured';
    try {
      await prisma.$queryRaw`SELECT 1`;
      return 'connected';
    } catch {
      return 'disconnected';
    }
  }
});

app.listen(env.port, () => {
  console.log(`Server listening on http://localhost:${env.port}`);
});
