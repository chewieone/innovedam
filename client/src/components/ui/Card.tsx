import type { ReactNode } from 'react';

export function Card({
  title,
  subtitle,
  children,
  className = ''
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white p-6 shadow-xs ${className}`}
    >
      {(title || subtitle) && (
        <header className="mb-4">
          {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
          {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
