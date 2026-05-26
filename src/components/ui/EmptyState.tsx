import { ReactNode } from 'react';

export function EmptyState({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-white/75 p-6 text-center shadow-lift">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-surface text-primary-text">{icon}</div>
      <h3 className="text-lg font-extrabold text-text-main">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-text-muted">{text}</p>
    </div>
  );
}
