import { useState } from 'react';
import type { ReactNode } from 'react';
import { Page, PumpingSession } from '../types';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { JournalTabs } from '../components/ui/JournalTabs';
import { formatDateTime, getCurrentIsraelDateTimeInputValue, israelDateTimeInputToIso, isoToIsraelDateTimeInputValue } from '../services/dateUtils';
import { sideLabel } from '../services/feedingUtils';
import { uid } from '../services/storageService';
import { Milk, Pencil, Trash2 } from 'lucide-react';

export function Pumping({ babyId, items, onSave, onDelete, setPage }: { babyId: string; items: PumpingSession[]; onSave: (item: PumpingSession) => void; onDelete: (id: string) => void; setPage: (page: Page) => void }) {
  const [editing, setEditing] = useState<PumpingSession | null>(null);
  const freshForm = () => ({ time: getCurrentIsraelDateTimeInputValue(), side: 'both', amountMl: 80, note: '' });
  const [form, setForm] = useState(freshForm);
  const submit = () => {
    onSave({ id: editing?.id ?? uid(), babyId, time: israelDateTimeInputToIso(form.time), side: form.side as PumpingSession['side'], amountMl: Number(form.amountMl), note: form.note || undefined, createdAt: editing?.createdAt ?? new Date().toISOString() });
    setEditing(null);
    setForm(freshForm());
  };
  const edit = (item: PumpingSession) => {
    setEditing(item);
    setForm({ time: isoToIsraelDateTimeInputValue(item.time), side: item.side, amountMl: item.amountMl, note: item.note ?? '' });
  };

  return <LogScreen title="שאיבות" active="pumping" setPage={setPage} icon={<Milk />} empty="עוד לא נשמרו שאיבות">
    <div className="rounded-3xl border border-white/85 bg-white/90 p-5 shadow-soft">
      <Fields form={form} setForm={setForm} kind="pumping" />
      <Button className="mt-4 w-full" onClick={submit}>{editing ? 'עדכון שאיבה' : 'שמירת שאיבה'}</Button>
    </div>
    <ItemList items={items} render={(item) => `${formatDateTime(item.time)} · ${sideLabel(item.side)} · ${item.amountMl} מ״ל`} onEdit={edit} onDelete={onDelete} />
  </LogScreen>;
}

function Fields({ form, setForm, kind }: { form: any; setForm: (value: any) => void; kind: 'pumping' | 'bottle' | 'diaper' }) {
  return <div className="space-y-3">
    <input className="field" type="datetime-local" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
    {kind === 'pumping' && <select className="field" value={form.side} onChange={(e) => setForm({ ...form, side: e.target.value })}><option value="right">ימין</option><option value="left">שמאל</option><option value="both">שני הצדדים</option></select>}
    {kind === 'bottle' && <select className="field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="breast_milk">חלב שאוב</option><option value="formula">תמ״ל</option><option value="other">אחר</option></select>}
    {kind === 'diaper' && <select className="field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="wet">רטוב</option><option value="dirty">יציאה</option><option value="both">גם וגם</option></select>}
    {kind !== 'diaper' && <input className="field" type="number" min="0" value={form.amountMl} onChange={(e) => setForm({ ...form, amountMl: Number(e.target.value) })} placeholder="כמות במ״ל" />}
    <input className="field" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="הערה, אם יש" />
  </div>;
}

export function LogScreen({ title, active, setPage, children }: { title: string; active: Page; setPage: (page: Page) => void; icon: ReactNode; empty: string; children: ReactNode }) {
  return <section className="space-y-4">
    <div><p className="text-sm font-bold text-primary-hover">יומן יומי</p><h1 className="text-3xl font-extrabold">{title}</h1></div>
    <JournalTabs active={active} onChange={setPage} />
    {children}
  </section>;
}

export function ItemList<T extends { id: string; note?: string }>({ items, render, onEdit, onDelete }: { items: T[]; render: (item: T) => string; onEdit: (item: T) => void; onDelete: (id: string) => void }) {
  if (items.length === 0) return <EmptyState icon={<Milk />} title="רשימה ריקה" text="כשתוסיפי פריט חדש הוא יישמר כאן." />;
  return <div className="space-y-3">
    {[...items].sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime()).map((item) => (
      <article key={item.id} className="rounded-3xl border border-white/85 bg-white/90 p-4 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div><p className="font-extrabold">{render(item)}</p>{item.note && <p className="text-sm text-text-main/60">{item.note}</p>}</div>
          <div className="flex gap-1">
            <Button variant="ghost" className="h-10 min-h-10 px-3" onClick={() => onEdit(item)} aria-label="עריכה"><Pencil size={17} /></Button>
            <Button variant="ghost" className="h-10 min-h-10 px-3 text-text-muted" onClick={() => onDelete(item.id)} aria-label="מחיקה"><Trash2 size={17} /></Button>
          </div>
        </div>
      </article>
    ))}
  </div>;
}
