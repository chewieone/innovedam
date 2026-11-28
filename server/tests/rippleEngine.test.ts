import { describe, expect, it } from 'vitest';
import {
  computeDecisionRipple,
  type RippleDataset
} from '../src/services/rippleEngine.js';

function createSyntheticDataset(): RippleDataset {
  return {
    employees: [
      { employeeId: 'EMP-1', team: 'Core', role: 'Manager', managerId: null, clearance: 'Internal' },
      { employeeId: 'EMP-2', team: 'Platform', role: 'Specialist', managerId: 'EMP-1', clearance: 'Internal' },
      { employeeId: 'EMP-3', team: 'Compliance', role: 'Manager', managerId: null, clearance: 'Confidential' },
      { employeeId: 'EMP-4', team: 'Ops', role: 'Associate', managerId: 'EMP-1', clearance: 'Internal' }
    ],
    workItems: [
      {
        workId: 'WRK-1',
        programId: 'PRG-A',
        deliverable: 'Architecture Spec',
        ownerId: 'EMP-1',
        team: 'Core',
        status: 'Open',
        dueDate: '2026-12-01',
        visibility: 'Internal'
      },
      {
        workId: 'WRK-2',
        programId: 'PRG-A',
        deliverable: 'Security Gate',
        ownerId: 'EMP-3',
        team: 'Compliance',
        status: 'Closed',
        dueDate: '2026-12-02',
        visibility: 'Confidential'
      },
      {
        workId: 'WRK-3',
        programId: 'PRG-A',
        deliverable: 'Rollout Plan',
        ownerId: 'EMP-4',
        team: 'Ops',
        status: 'Open',
        dueDate: '2026-12-03',
        visibility: 'Internal'
      },
      {
        workId: 'WRK-4',
        programId: 'PRG-A',
        deliverable: 'Runbook Update',
        ownerId: 'EMP-4',
        team: 'Ops',
        status: 'Open',
        dueDate: '2026-12-04',
        visibility: 'Internal'
      },
      {
        workId: 'WRK-5',
        programId: 'PRG-A',
        deliverable: 'Vendor Audit',
        ownerId: 'EMP-3',
        team: 'Compliance',
        status: 'Open',
        dueDate: '2026-12-05',
        visibility: 'Confidential'
      }
    ],
    dependencies: [
      { prerequisiteWorkId: 'WRK-1', dependentWorkId: 'WRK-2', relationship: 'requires' },
      { prerequisiteWorkId: 'WRK-2', dependentWorkId: 'WRK-3', relationship: 'requires' },
      { prerequisiteWorkId: 'WRK-3', dependentWorkId: 'WRK-4', relationship: 'requires' },
      { prerequisiteWorkId: 'WRK-2', dependentWorkId: 'WRK-5', relationship: 'requires' },
      // Cycle back-edge to verify cycle-safe traversal
      { prerequisiteWorkId: 'WRK-4', dependentWorkId: 'WRK-1', relationship: 'requires' }
    ],
    decisions: [
      {
        decisionId: 'DEC-DRAFT',
        timestamp: '2026-11-28 10:00:00',
        programId: 'PRG-A',
        rootWorkId: 'WRK-1',
        deciderId: 'EMP-1',
        deciderTeam: 'Core',
        decisionType: 'Reschedule',
        status: 'Draft',
        visibility: 'Internal',
        reversesId: null,
        decisionText: 'Draft reschedule for Architecture Spec.'
      },
      {
        decisionId: 'DEC-CONF',
        timestamp: '2026-11-28 11:00:00',
        programId: 'PRG-A',
        rootWorkId: 'WRK-1',
        deciderId: 'EMP-3',
        deciderTeam: 'Compliance',
        decisionType: 'Scope change',
        status: 'Approved',
        visibility: 'Confidential',
        reversesId: null,
        decisionText: 'SECRET_CLAUSE: Hold vendor payout pending audit findings.'
      },
      {
        decisionId: 'DEC-REV',
        timestamp: '2026-11-28 12:00:00',
        programId: 'PRG-A',
        rootWorkId: 'WRK-1',
        deciderId: 'EMP-3',
        deciderTeam: 'Compliance',
        decisionType: 'Reverse',
        status: 'Approved',
        visibility: 'Confidential',
        reversesId: 'DEC-CONF',
        decisionText: 'SECRET_REVERSAL: Lift hold on vendor payout.'
      }
    ]
  };
}

describe('Ripple Engine (R1-R5)', () => {
  it('R1: draft decisions do not trigger owner notifications', () => {
    const result = computeDecisionRipple(createSyntheticDataset(), 'DEC-DRAFT', 'Internal');

    expect(result.triggered).toBe(false);
    expect(result.actionState).toBe('None');
    expect(result.notifiedOwners).toEqual([]);
    expect(result.affectedNodes.length).toBe(5);
  });

  it('R2 & R3: traverses closed items transitively without notifying for the closed item, aggregating distinct open owners', () => {
    const result = computeDecisionRipple(createSyntheticDataset(), 'DEC-CONF', 'Confidential');

    expect(result.triggered).toBe(true);
    expect(result.affectedNodes.map((n) => n.workId)).toEqual([
      'WRK-1',
      'WRK-2',
      'WRK-3',
      'WRK-5',
      'WRK-4'
    ]);

    const closedNode = result.affectedNodes.find((n) => n.workId === 'WRK-2');
    expect(closedNode?.isClosedPassThrough).toBe(true);
    expect(closedNode?.notifiesOwner).toBe(false);

    // EMP-3 owns WRK-2 (Closed) and WRK-5 (Open) -> notified ONLY for WRK-5.
    // EMP-4 owns WRK-3 and WRK-4 (both Open) -> notified once with both IDs.
    expect(result.notifiedOwners).toEqual([
      expect.objectContaining({
        recipientEmployeeId: 'EMP-1',
        affectedOpenWorkIds: ['WRK-1']
      }),
      expect.objectContaining({
        recipientEmployeeId: 'EMP-3',
        affectedOpenWorkIds: ['WRK-5']
      }),
      expect.objectContaining({
        recipientEmployeeId: 'EMP-4',
        affectedOpenWorkIds: ['WRK-3', 'WRK-4']
      })
    ]);
  });

  it('R4: redacts Confidential decisionText for Internal clearance and provides safe action context', () => {
    const internalView = computeDecisionRipple(createSyntheticDataset(), 'DEC-CONF', 'Internal');

    expect(internalView.decision.isRedacted).toBe(true);
    expect(internalView.decision.decisionText).toBeNull();
    expect(internalView.decision.safeActionContext).not.toContain('SECRET_CLAUSE');

    const internalOwnerNotif = internalView.notifiedOwners.find(
      (n) => n.recipientEmployeeId === 'EMP-4'
    );
    expect(internalOwnerNotif?.safeActionContext).not.toContain('SECRET_CLAUSE');
    expect(internalOwnerNotif?.safeActionContext).toContain('WRK-3');

    const confidentialView = computeDecisionRipple(
      createSyntheticDataset(),
      'DEC-CONF',
      'Confidential'
    );
    expect(confidentialView.decision.isRedacted).toBe(false);
    expect(confidentialView.decision.decisionText).toContain('SECRET_CLAUSE');
  });

  it('R5: reversal decisions withdraw/review actions across the referenced decision scope', () => {
    const reversal = computeDecisionRipple(createSyntheticDataset(), 'DEC-REV', 'Internal');

    expect(reversal.triggered).toBe(true);
    expect(reversal.actionState).toBe('Withdrawn_Review');
    expect(reversal.reversedDecisionId).toBe('DEC-CONF');
    expect(reversal.decision.isRedacted).toBe(true);
    expect(reversal.decision.decisionText).toBeNull();
    expect(reversal.decision.safeActionContext).not.toContain('SECRET_REVERSAL');
    expect(reversal.notifiedOwners.every((n) => n.actionState === 'Withdrawn_Review')).toBe(
      true
    );
  });
});
