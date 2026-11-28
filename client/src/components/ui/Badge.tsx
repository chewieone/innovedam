import type { ReactNode } from 'react';

export type BadgeVariant = 'neutral' | 'open' | 'closed' | 'confidential' | 'reversed';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: 'bg-slate-100 text-slate-800 border-slate-300',
  open: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  closed: 'bg-slate-100 text-slate-600 border-slate-300 border-dashed',
  confidential: 'bg-amber-50 text-amber-900 border-amber-300',
  reversed: 'bg-rose-50 text-rose-800 border-rose-300'
};

export function Badge({
  variant = 'neutral',
  children
}: {
  variant?: BadgeVariant;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </span>
  );
}
