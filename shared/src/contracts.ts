import { z } from 'zod';

export const ClearanceSchema = z.enum(['Internal', 'Confidential']);
export type Clearance = z.infer<typeof ClearanceSchema>;

export const WorkItemStatusSchema = z.enum(['Open', 'Closed']);
export type WorkItemStatus = z.infer<typeof WorkItemStatusSchema>;

export const DecisionStatusSchema = z.enum(['Draft', 'Approved']);
export type DecisionStatus = z.infer<typeof DecisionStatusSchema>;

export const OnboardingStatusSchema = z.enum(['Pending', 'Approved', 'Rejected']);
export type OnboardingStatus = z.infer<typeof OnboardingStatusSchema>;

export const NotificationActionStateSchema = z.enum(['Active', 'Withdrawn_Review']);
export type NotificationActionState = z.infer<typeof NotificationActionStateSchema>;

export const ApiErrorDetailSchema = z.object({
  field: z.string().optional(),
  message: z.string()
});

export const ApiErrorEnvelopeSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.array(ApiErrorDetailSchema).optional()
  })
});
export type ApiErrorEnvelope = z.infer<typeof ApiErrorEnvelopeSchema>;

export const HealthResponseSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  service: z.string(),
  database: z.enum(['connected', 'disconnected', 'unconfigured']),
  timestamp: z.string()
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export const RegisterRequestSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8).max(128),
    fullName: z.string().trim().min(2).max(100)
  })
  .strict();
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const LoginRequestSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1).max(128)
  })
  .strict();
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const EmployeeRowSchema = z.object({
  employee_id: z.string().trim().min(1),
  team: z.string().trim().min(1),
  role: z.string().trim().min(1),
  manager_id: z.string().trim().optional().default(''),
  clearance: ClearanceSchema
});
export type EmployeeRow = z.infer<typeof EmployeeRowSchema>;

export const WorkItemRowSchema = z.object({
  work_id: z.string().trim().min(1),
  program_id: z.string().trim().min(1),
  deliverable: z.string().trim().min(1),
  owner_id: z.string().trim().min(1),
  team: z.string().trim().min(1),
  status: WorkItemStatusSchema,
  due_date: z.string().trim().min(1),
  visibility: ClearanceSchema
});
export type WorkItemRow = z.infer<typeof WorkItemRowSchema>;

export const DependencyRowSchema = z.object({
  dependent_work_id: z.string().trim().min(1),
  prerequisite_work_id: z.string().trim().min(1),
  relationship: z.string().trim().min(1)
});
export type DependencyRow = z.infer<typeof DependencyRowSchema>;

export const DecisionRowSchema = z.object({
  decision_id: z.string().trim().min(1),
  timestamp: z.string().trim().min(1),
  program_id: z.string().trim().min(1),
  root_work_id: z.string().trim().min(1),
  decider_id: z.string().trim().min(1),
  decision_type: z.string().trim().min(1),
  status: DecisionStatusSchema,
  visibility: ClearanceSchema,
  reverses_id: z.string().trim().optional().default(''),
  decision_text: z.string().trim().min(1)
});
export type DecisionRow = z.infer<typeof DecisionRowSchema>;

export const RuleRowSchema = z.object({
  rule: z.string().trim().min(1),
  description: z.string().trim().min(1)
});
export type RuleRow = z.infer<typeof RuleRowSchema>;

export const WorkbookPayloadSchema = z.object({
  employees: z.array(EmployeeRowSchema).min(1),
  workItems: z.array(WorkItemRowSchema).min(1),
  dependencies: z.array(DependencyRowSchema),
  decisions: z.array(DecisionRowSchema),
  rules: z.array(RuleRowSchema).min(1)
});
export type WorkbookPayload = z.infer<typeof WorkbookPayloadSchema>;

export interface RippleNodeDto {
  workId: string;
  programId: string;
  deliverable: string;
  ownerId: string;
  team: string;
  status: WorkItemStatus;
  visibility: Clearance;
  hopDepth: number;
  isRoot: boolean;
  isClosedPassThrough: boolean;
  notifiesOwner: boolean;
}

export interface RippleEdgeDto {
  prerequisiteWorkId: string;
  dependentWorkId: string;
  relationship: string;
}

export interface AffectedOwnerNotificationDto {
  recipientEmployeeId: string;
  recipientTeam: string;
  recipientClearance: Clearance;
  affectedOpenWorkIds: string[];
  actionState: NotificationActionState;
  safeActionContext: string;
}

export interface RedactedDecisionDto {
  decisionId: string;
  timestamp: string;
  programId: string;
  rootWorkId: string;
  deciderId: string;
  decisionType: string;
  status: DecisionStatus;
  visibility: Clearance;
  reversesId: string | null;
  isRedacted: boolean;
  decisionText: string | null;
  safeActionContext: string;
}

export interface RippleResponseDto {
  decision: RedactedDecisionDto;
  triggered: boolean;
  actionState: NotificationActionState | 'None';
  reversedDecisionId: string | null;
  affectedNodes: RippleNodeDto[];
  edges: RippleEdgeDto[];
  notifiedOwners: AffectedOwnerNotificationDto[];
}
