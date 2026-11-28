import type {
  Clearance,
  DecisionStatus,
  NotificationActionState,
  RedactedDecisionDto
} from '@innovedam/shared';

export interface DecisionRecord {
  decisionId: string;
  timestamp: string;
  programId: string;
  rootWorkId: string;
  deciderId: string;
  deciderTeam?: string;
  decisionType: string;
  status: DecisionStatus;
  visibility: Clearance;
  reversesId: string | null;
  decisionText: string;
}

export function buildSafeActionContext(params: {
  decisionId: string;
  decisionType: string;
  actionState: NotificationActionState | 'None';
  affectedOpenDeliverables: string[];
  deciderTeam?: string;
}): string {
  const deliverablesText =
    params.affectedOpenDeliverables.length > 0
      ? params.affectedOpenDeliverables.join(', ')
      : 'your assigned deliverables';

  if (params.actionState === 'Withdrawn_Review') {
    return `Confidential reversal (${params.decisionId}): withdraw/review prior action impacting ${deliverablesText}. Coordinate with ${params.deciderTeam ?? 'your manager'}.`;
  }

  if (params.actionState === 'None') {
    return `Draft confidential decision (${params.decisionId}) — no action triggered.`;
  }

  return `Confidential ${params.decisionType.toLowerCase()} decision (${params.decisionId}) impacts open work (${deliverablesText}). Review schedule/dependencies with ${params.deciderTeam ?? 'your manager'}.`;
}

export function redactDecisionForViewer(
  decision: DecisionRecord,
  viewerClearance: Clearance,
  actionState: NotificationActionState | 'None',
  affectedOpenDeliverables: string[] = []
): RedactedDecisionDto {
  const mustRedact =
    viewerClearance === 'Internal' && decision.visibility === 'Confidential';

  const safeActionContext = buildSafeActionContext({
    decisionId: decision.decisionId,
    decisionType: decision.decisionType,
    actionState,
    affectedOpenDeliverables,
    deciderTeam: decision.deciderTeam
  });

  if (mustRedact) {
    return {
      decisionId: decision.decisionId,
      timestamp: decision.timestamp,
      programId: decision.programId,
      rootWorkId: decision.rootWorkId,
      deciderId: decision.deciderId,
      decisionType: decision.decisionType,
      status: decision.status,
      visibility: decision.visibility,
      reversesId: decision.reversesId,
      isRedacted: true,
      decisionText: null,
      safeActionContext
    };
  }

  return {
    decisionId: decision.decisionId,
    timestamp: decision.timestamp,
    programId: decision.programId,
    rootWorkId: decision.rootWorkId,
    deciderId: decision.deciderId,
    decisionType: decision.decisionType,
    status: decision.status,
    visibility: decision.visibility,
    reversesId: decision.reversesId,
    isRedacted: false,
    decisionText: decision.decisionText,
    safeActionContext: decision.decisionText
  };
}
