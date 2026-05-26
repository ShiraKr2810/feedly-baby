import { useState } from 'react';
import { DiaperLog, Page } from '../types';
import { Button } from '../components/ui/Button';
import { formatDateTime, getCurrentIsraelDateTimeInputValue, israelDateTimeInputToIso, isoToIsraelDateTimeInputValue } from '../services/dateUtils';
import { uid } from '../services/storageService';
import { ItemList, LogScreen } from './Pumping';

const diaperType = (type: DiaperLog['type']) => (type === 'wet' ? 'רטוב' : type === 'dirty' ? 'יציאה' : 'גם וגם');

export function Diapers({ babyId, items, onSave, onDelete, setPage }: { babyId: string; items: DiaperLog[]; onSave: (item: DiaperLog) => void; onDelete: (id: string) => void; setPage: (page: Page) => void }) {
  const [editing, setEditing] = useState<DiaperLog | null>(null);
  const freshForm = () => ({ time: getCurrentIsraelDateTimeInputValue(), type: 'wet', note: '' });
  const [form, setForm] = useState(freshForm);
  const submit = () => {
    onSave({ id: editing?.id ?? uid(), babyId, time: israelDateTimeInputToIso(form.time), type: form.type as DiaperLog['type'], note: form.note || undefined, createdAt: editing?.createdAt ?? new Date().toISOString() });
    setEditing(null); setForm(freshForm());
  };
  return <LogScreen title="טיטולים" active="diapers" setPage={setPage} icon={null} empty="">
    <div className="space-y-3 rounded-3xl border border-white/85 bg-white/90 p-5 shadow-soft">
      <input className="field" type="datetime-local" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
      <select className="field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="wet">רטוב</option><option value="dirty">יציאה</option><option value="both">גם וגם</option></select>
      <input className="field" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="הערה, אם יש" />
      <Button className="w-full" onClick={submit}>{editing ? 'עדכון טיטול' : 'שמירת טיטול'}</Button>
    </div>
    <ItemList items={items} render={(item) => `${formatDateTime(item.time)} · ${diaperType(item.type)}`} onEdit={(item) => { setEditing(item); setForm({ time: isoToIsraelDateTimeInputValue(item.time), type: item.type, note: item.note ?? '' }); }} onDelete={onDelete} />
  </LogScreen>;
}
