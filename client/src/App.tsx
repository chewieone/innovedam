import { useEffect, useState } from 'react';
import type { HealthResponse } from '@innovedam/shared';
import { Badge } from './components/ui/Badge';
import { Card } from './components/ui/Card';

export function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/v1/health', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as HealthResponse;
      })
      .then((data) => {
        if (active) setHealth(data);
      })
      .catch((err: unknown) => {
        if (active) {
          setHealthError(err instanceof Error ? err.message : 'Unable to reach API');
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">
              PS-02 · The Ripple Effect
            </h1>
            <p className="text-xs text-slate-600">
              M1 Scaffold Checkpoint — Hierarchy, Onboarding &amp; R1–R5 Impact Engine
            </p>
          </div>
          <div className="flex items-center gap-2">
            {health ? (
              <Badge variant="open">
                API: {health.status} · DB: {health.database}
              </Badge>
            ) : healthError ? (
              <Badge variant="reversed">API offline ({healthError})</Badge>
            ) : (
              <Badge variant="neutral">Checking API...</Badge>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-8 md:grid-cols-2">
        <Card
          title="Workspace & MyGate Onboarding"
          subtitle="Company hierarchy, manager-approval requests, and scoped team/work views."
        >
          <p className="text-sm text-slate-600">
            Scaffold shell ready for Role B views: Sign In / Register, Pending Approval
            screen, Manager Onboarding Queue, My Team, My Work, and My Decisions.
          </p>
        </Card>

        <Card
          title="R1–R5 Ripple Engine & Confidentiality"
          subtitle="Server-enforced clearance redaction with deterministic safe action context."
        >
          <div className="flex flex-wrap gap-2">
            <Badge variant="open">R1: Approved Triggers</Badge>
            <Badge variant="neutral">R2: Transitive DAG</Badge>
            <Badge variant="closed">R3: Closed Pass-Through</Badge>
            <Badge variant="confidential">R4: Clearance Redaction</Badge>
            <Badge variant="reversed">R5: Reversal Scope</Badge>
          </div>
        </Card>
      </main>
    </div>
  );
}
export default App;
