import request from 'supertest';
import bcrypt from 'bcryptjs';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { createInMemoryAuthStore } from '../src/routes/authRouter.js';
import type { RippleDataset } from '../src/services/rippleEngine.js';

function createTestDataset(): RippleDataset {
  return {
    employees: [
      { employeeId: 'EMP-INT', team: 'Engineering', role: 'Associate', managerId: null, clearance: 'Internal' },
      { employeeId: 'EMP-SEC', team: 'Finance', role: 'Manager', managerId: null, clearance: 'Confidential' }
    ],
    workItems: [
      {
        workId: 'WRK-10',
        programId: 'PRG-X',
        deliverable: 'Budget Plan',
        ownerId: 'EMP-SEC',
        team: 'Finance',
        status: 'Open',
        dueDate: '2026-12-10',
        visibility: 'Confidential'
      },
      {
        workId: 'WRK-11',
        programId: 'PRG-X',
        deliverable: 'Service Build',
        ownerId: 'EMP-INT',
        team: 'Engineering',
        status: 'Open',
        dueDate: '2026-12-12',
        visibility: 'Internal'
      }
    ],
    dependencies: [
      { prerequisiteWorkId: 'WRK-10', dependentWorkId: 'WRK-11', relationship: 'requires' }
    ],
    decisions: [
      {
        decisionId: 'DEC-100',
        timestamp: '2026-11-28 14:00:00',
        programId: 'PRG-X',
        rootWorkId: 'WRK-10',
        deciderId: 'EMP-SEC',
        deciderTeam: 'Finance',
        decisionType: 'Budget revision',
        status: 'Approved',
        visibility: 'Confidential',
        reversesId: null,
        decisionText: 'TOP_SECRET_BUDGET_CAP_42'
      }
    ]
  };
}

describe('Scaffold API & R4 Redaction Requirement', () => {
  it('GET /api/v1/health returns agreed contract shape', async () => {
    const app = createApp({ probeDb: async () => 'unconfigured' });
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'ok',
      service: 'innovedam-api',
      database: 'unconfigured'
    });
    expect(typeof res.body.timestamp).toBe('string');
  });

  it('rejects unauthenticated access to ripple endpoint with standard error envelope', async () => {
    const app = createApp({ getDataset: async () => createTestDataset() });
    const res = await request(app).get('/api/v1/companies/comp-1/decisions/DEC-100/ripple');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Authentication required'
      }
    });
  });

  it('R4 server requirement: redacts Confidential decision text for Internal user but returns it for Confidential user', async () => {
    const passwordHash = await bcrypt.hash('TestPass123!', 4);
    const authStore = createInMemoryAuthStore([
      {
        id: 'u-internal',
        email: 'internal@example.test',
        fullName: 'Internal Engineer',
        passwordHash,
        clearance: 'Internal',
        companyId: 'comp-1',
        employeeId: 'EMP-INT'
      },
      {
        id: 'u-conf',
        email: 'confidential@example.test',
        fullName: 'Finance Manager',
        passwordHash,
        clearance: 'Confidential',
        companyId: 'comp-1',
        employeeId: 'EMP-SEC'
      }
    ]);

    const app = createApp({
      authStore,
      getDataset: async (companyId) => (companyId === 'comp-1' ? createTestDataset() : null)
    });

    // 1. Internal user logs in via HttpOnly cookie
    const internalAgent = request.agent(app);
    const internalLogin = await internalAgent
      .post('/api/v1/auth/login')
      .send({ email: 'internal@example.test', password: 'TestPass123!' });
    expect(internalLogin.status).toBe(200);

    const internalRipple = await internalAgent.get(
      '/api/v1/companies/comp-1/decisions/DEC-100/ripple'
    );
    expect(internalRipple.status).toBe(200);
    expect(internalRipple.body.decision.isRedacted).toBe(true);
    expect(internalRipple.body.decision.decisionText).toBeNull();
    expect(JSON.stringify(internalRipple.body)).not.toContain('TOP_SECRET_BUDGET_CAP_42');

    // 2. Confidential user logs in and receives unredacted decision text
    const confAgent = request.agent(app);
    const confLogin = await confAgent
      .post('/api/v1/auth/login')
      .send({ email: 'confidential@example.test', password: 'TestPass123!' });
    expect(confLogin.status).toBe(200);

    const confRipple = await confAgent.get(
      '/api/v1/companies/comp-1/decisions/DEC-100/ripple'
    );
    expect(confRipple.status).toBe(200);
    expect(confRipple.body.decision.isRedacted).toBe(false);
    expect(confRipple.body.decision.decisionText).toBe('TOP_SECRET_BUDGET_CAP_42');
  });
});
