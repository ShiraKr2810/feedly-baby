import { useState } from 'react';
import { BottleSession, Page } from '../types';
import { Button } from '../components/ui/Button';
import { formatDateTime, getCurrentIsraelDateTimeInputValue, israelDateTimeInputToIso, isoToIsraelDateTimeInputValue } from '../services/dateUtils';
import { uid } from '../services/storageService';
import { LogScreen, ItemList } from './Pumping';

const bottleType = (type: BottleSession['type']) => (type === 'breast_milk' ? 'חלב שאוב' : type === 'formula' ? 'תמ״ל' : 'אחר');

export function Bottles({ babyId, items, onSave, onDelete, setPage }: { babyId: string; items: BottleSession[]; onSave: (item: BottleSession) => void; onDelete: (id: string) => void; setPage: (page: Page) => void }) {
  const [editing, setEditing] = useState<BottleSession | null>(null);
  const freshForm = () => ({ time: getCurrentIsraelDateTimeInputValue(), type: 'breast_milk', amountMl: 90, note: '' });
  const [form, setForm] = useState(freshForm);
  const submit = () => {
    onSave({ id: editing?.id ?? uid(), babyId, time: israelDateTimeInputToIso(form.time), type: form.type as BottleSession['type'], amountMl: Number(form.amountMl), note: form.note || undefined, createdAt: editing?.createdAt ?? new Date().toISOString() });
    setEditing(null); setForm(freshForm());
  };
  return <LogScreen title="בקבוקים" active="bottles" setPage={setPage} icon={null} empty="">
    <div className="space-y-3 rounded-3xl border border-white/85 bg-white/90 p-5 shadow-soft">
      <input className="field" type="datetime-local" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
      <select className="field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="breast_milk">חלב שאוב</option><option value="formula">תמ״ל</option><option value="other">אחר</option></select>
      <input className="field" type="number" min="0" value={form.amountMl} onChange={(e) => setForm({ ...form, amountMl: Number(e.target.value) })} placeholder="כמות במ״ל" />
      <input className="field" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="הערה, אם יש" />
      <Button className="w-full" onClick={submit}>{editing ? 'עדכון בקבוק' : 'שמירת בקבוק'}</Button>
    </div>
    <ItemList items={items} render={(item) => `${formatDateTime(item.time)} · ${bottleType(item.type)} · ${item.amountMl} מ״ל`} onEdit={(item) => { setEditing(item); setForm({ time: isoToIsraelDateTimeInputValue(item.time), type: item.type, amountMl: item.amountMl, note: item.note ?? '' }); }} onDelete={onDelete} />
  </LogScreen>;
}
