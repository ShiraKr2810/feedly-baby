import { ReactNode } from 'react';

export function EmptyState({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="theme-card rounded-3xl border-dashed p-6 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-surface text-primary-text">{icon}</div>
      <h3 className="text-lg font-extrabold">{title}</h3>
      <p className="theme-muted mt-1 text-sm leading-6">{text}</p>
    </div>
  );
}
