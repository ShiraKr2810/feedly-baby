import { FormEvent, useState } from 'react';
import { Baby, AppSettings } from '../types';
import { uid } from '../services/storageService';
import { Button } from '../components/ui/Button';
import { Baby as BabyIcon, Moon } from 'lucide-react';

export function Onboarding({ onDone }: { onDone: (baby: Baby, settings: AppSettings) => void }) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [nightStart, setNightStart] = useState('20:00');
  const [nightEnd, setNightEnd] = useState('06:00');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !birthDate) return;
    onDone(
      { id: uid(), name: name.trim(), birthDate, createdAt: new Date().toISOString() },
      { nightStart, nightEnd, themeMode: 'auto' },
    );
  };

  return (
    <main dir="rtl" className="min-h-screen bg-app px-5 py-8 text-text-main">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[480px] flex-col justify-between">
        <div>
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-surface text-primary-text shadow-soft">
              <BabyIcon />
            </div>
            <div>
              <p className="text-sm font-bold text-primary-hover">Feedly Baby</p>
              <h1 className="text-3xl font-extrabold tracking-normal">מעקב הנקה רגוע יותר</h1>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/85 bg-white/90 p-5 shadow-soft">
            <div className="mb-6 rounded-3xl bg-gradient-to-br from-primary/45 via-white/70 to-pink/35 p-5">
              <Moon className="mb-10 text-text-main/70" />
              <h2 className="text-2xl font-extrabold">מצב לילה חכם</h2>
              <p className="mt-2 leading-7 text-text-main/70">כפתורים גדולים, תאורה נמוכה ושמירה מהירה כשאת עייפה.</p>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-bold text-text-main/60">שם התינוק/ת</span>
                <input className="field" value={name} onChange={(event) => setName(event.target.value)} placeholder="לדוגמה: נועה" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-bold text-text-main/60">תאריך לידה</span>
                <input className="field" type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label>
                  <span className="mb-1 block text-sm font-bold text-text-main/60">לילה מתחיל</span>
                  <input className="field" type="time" value={nightStart} onChange={(event) => setNightStart(event.target.value)} />
                </label>
                <label>
                  <span className="mb-1 block text-sm font-bold text-text-main/60">לילה מסתיים</span>
                  <input className="field" type="time" value={nightEnd} onChange={(event) => setNightEnd(event.target.value)} />
                </label>
              </div>
              <Button className="w-full text-lg">התחילי מעקב</Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
