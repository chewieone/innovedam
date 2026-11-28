import { Router } from 'express';
import type { Clearance } from '@innovedam/shared';
import { AppError } from '../middleware/errorHandler.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  computeDecisionRipple,
  type RippleDataset
} from '../services/rippleEngine.js';

export type DatasetProvider = (companyId: string) => Promise<RippleDataset | null>;

export function createDecisionsRouter(getDataset: DatasetProvider): Router {
  const router = Router();

  router.get(
    '/companies/:companyId/decisions/:decisionId/ripple',
    requireAuth,
    async (req, res, next) => {
      try {
        const companyId = String(req.params.companyId);
        const decisionId = String(req.params.decisionId);
        const dataset = await getDataset(companyId);

        if (!dataset) {
          throw new AppError(404, 'COMPANY_NOT_FOUND', `Company ${companyId} not found`);
        }

        const exists = dataset.decisions.some((d) => d.decisionId === decisionId);
        if (!exists) {
          throw new AppError(404, 'DECISION_NOT_FOUND', `Decision ${decisionId} not found`);
        }

        const viewerClearance: Clearance = req.authUser?.clearance ?? 'Internal';
        const ripple = computeDecisionRipple(dataset, decisionId, viewerClearance);
        res.status(200).json(ripple);
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
}
