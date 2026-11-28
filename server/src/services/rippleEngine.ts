import type {
  AffectedOwnerNotificationDto,
  Clearance,
  NotificationActionState,
  RippleEdgeDto,
  RippleNodeDto,
  RippleResponseDto,
  WorkItemStatus
} from '@innovedam/shared';
import {
  buildSafeActionContext,
  redactDecisionForViewer,
  type DecisionRecord
} from './redactionService.js';

export interface EngineEmployee {
  employeeId: string;
  team: string;
  role: string;
  managerId: string | null;
  clearance: Clearance;
}

export interface EngineWorkItem {
  workId: string;
  programId: string;
  deliverable: string;
  ownerId: string;
  team: string;
  status: WorkItemStatus;
  dueDate: string;
  visibility: Clearance;
}

export interface EngineDependency {
  dependentWorkId: string;
  prerequisiteWorkId: string;
  relationship: string;
}

export interface RippleDataset {
  employees: EngineEmployee[];
  workItems: EngineWorkItem[];
  dependencies: EngineDependency[];
  decisions: DecisionRecord[];
}

/**
 * Deterministic PS-02 ripple traversal enforcing Rules R1-R5.
 * Never assumes client-side filtering; caller must pass authenticated viewerClearance.
 */
export function computeDecisionRipple(
  dataset: RippleDataset,
  decisionId: string,
  viewerClearance: Clearance
): RippleResponseDto {
  const decisionById = new Map(dataset.decisions.map((d) => [d.decisionId, d]));
  const workItemById = new Map(dataset.workItems.map((w) => [w.workId, w]));
  const employeeById = new Map(dataset.employees.map((e) => [e.employeeId, e]));

  const decision = decisionById.get(decisionId);
  if (!decision) {
    throw new Error(`Decision not found: ${decisionId}`);
  }

  // R5: Reversals operate on the referenced decision's scope when reversing an approved decision.
  const referencedDecision = decision.reversesId
    ? decisionById.get(decision.reversesId) ?? null
    : null;
  const scopeRootWorkId = referencedDecision
    ? referencedDecision.rootWorkId
    : decision.rootWorkId;

  const rootItem = workItemById.get(scopeRootWorkId);
  if (!rootItem) {
    throw new Error(`Root work item not found: ${scopeRootWorkId}`);
  }

  // Build adjacency list from prerequisite -> dependent (R2).
  const outgoing = new Map<string, EngineDependency[]>();
  for (const dep of dataset.dependencies) {
    const list = outgoing.get(dep.prerequisiteWorkId) ?? [];
    list.push(dep);
    outgoing.set(dep.prerequisiteWorkId, list);
  }

  // BFS traversal with visited set for cycle safety (R2 + R3 closed pass-through).
  const visitedDepth = new Map<string, number>();
  const queue: Array<{ workId: string; depth: number }> = [
    { workId: scopeRootWorkId, depth: 0 }
  ];
  visitedDepth.set(scopeRootWorkId, 0);

  const traversedEdges: RippleEdgeDto[] = [];
  const seenEdgeKeys = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    const dependents = outgoing.get(current.workId) ?? [];
    for (const edge of dependents) {
      if (!workItemById.has(edge.dependentWorkId)) continue;

      const edgeKey = `${edge.prerequisiteWorkId}->${edge.dependentWorkId}:${edge.relationship}`;
      if (!seenEdgeKeys.has(edgeKey)) {
        seenEdgeKeys.add(edgeKey);
        traversedEdges.push({
          prerequisiteWorkId: edge.prerequisiteWorkId,
          dependentWorkId: edge.dependentWorkId,
          relationship: edge.relationship
        });
      }

      if (!visitedDepth.has(edge.dependentWorkId)) {
        visitedDepth.set(edge.dependentWorkId, current.depth + 1);
        queue.push({ workId: edge.dependentWorkId, depth: current.depth + 1 });
      }
    }
  }

  // R1: Only Approved decisions trigger actions.
  const triggered = decision.status === 'Approved';
  const isReversal = decision.decisionType === 'Reverse' || Boolean(decision.reversesId);
  const actionState: NotificationActionState | 'None' = !triggered
    ? 'None'
    : isReversal
      ? 'Withdrawn_Review'
      : 'Active';

  const affectedNodes: RippleNodeDto[] = [];
  const openItemsByOwner = new Map<string, EngineWorkItem[]>();

  for (const [workId, hopDepth] of visitedDepth.entries()) {
    const item = workItemById.get(workId)!;
    const isClosed = item.status === 'Closed';
    const notifiesOwner = triggered && !isClosed;

    affectedNodes.push({
      workId: item.workId,
      programId: item.programId,
      deliverable: item.deliverable,
      ownerId: item.ownerId,
      team: item.team,
      status: item.status,
      visibility: item.visibility,
      hopDepth,
      isRoot: item.workId === scopeRootWorkId,
      isClosedPassThrough: isClosed,
      notifiesOwner
    });

    if (notifiesOwner) {
      const list = openItemsByOwner.get(item.ownerId) ?? [];
      list.push(item);
      openItemsByOwner.set(item.ownerId, list);
    }
  }

  affectedNodes.sort((a, b) => a.hopDepth - b.hopDepth || a.workId.localeCompare(b.workId));

  // R3 + R4: Distinct owners of Open affected work with clearance-safe context.
  const notifiedOwners: AffectedOwnerNotificationDto[] = [];
  if (triggered && actionState !== 'None') {
    for (const [ownerId, openItems] of openItemsByOwner.entries()) {
      const owner = employeeById.get(ownerId);
      const ownerClearance: Clearance = owner?.clearance ?? 'Internal';
      const ownerTeam = owner?.team ?? openItems[0]?.team ?? 'Unknown';
      const openWorkLabels = openItems.map((i) => `${i.workId} (${i.deliverable})`);

      const mustRedactForRecipient =
        (viewerClearance === 'Internal' || ownerClearance === 'Internal') &&
        decision.visibility === 'Confidential';

      const safeContext = mustRedactForRecipient
        ? buildSafeActionContext({
            decisionId: decision.decisionId,
            decisionType: decision.decisionType,
            actionState,
            affectedOpenDeliverables: openWorkLabels,
            deciderTeam: decision.deciderTeam
          })
        : decision.decisionText;

      notifiedOwners.push({
        recipientEmployeeId: ownerId,
        recipientTeam: ownerTeam,
        recipientClearance: ownerClearance,
        affectedOpenWorkIds: openItems.map((i) => i.workId).sort(),
        actionState,
        safeActionContext: safeContext
      });
    }
    notifiedOwners.sort((a, b) =>
      a.recipientEmployeeId.localeCompare(b.recipientEmployeeId)
    );
  }

  const viewerAffectedLabels = affectedNodes
    .filter((n) => !n.isClosedPassThrough)
    .map((n) => `${n.workId} (${n.deliverable})`)
    .slice(0, 5);

  const redactedDecision = redactDecisionForViewer(
    decision,
    viewerClearance,
    actionState,
    viewerAffectedLabels
  );

  return {
    decision: redactedDecision,
    triggered,
    actionState,
    reversedDecisionId: referencedDecision?.decisionId ?? decision.reversesId ?? null,
    affectedNodes,
    edges: traversedEdges,
    notifiedOwners
  };
}
