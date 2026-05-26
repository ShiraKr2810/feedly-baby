import { Baby, AppSettings } from '../types';
import { Button } from '../components/ui/Button';
import { storageService } from '../services/storageService';

export function Settings({ baby, settings, onBaby, onSettings, onReset }: { baby: Baby; settings: AppSettings; onBaby: (baby: Baby) => void; onSettings: (settings: AppSettings) => void; onReset: () => void }) {
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(storageService.exportAll(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'feedly-baby-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };
  return <section className="space-y-4">
    <div><p className="text-sm font-bold text-primary-hover">התאמה אישית</p><h1 className="text-3xl font-extrabold">הגדרות</h1></div>
    <div className="space-y-3 rounded-3xl border border-white/85 bg-white/90 p-5 shadow-soft">
      <label><span className="mb-1 block text-sm font-bold text-text-main/60">שם התינוק/ת</span><input className="field" value={baby.name} onChange={(e) => onBaby({ ...baby, name: e.target.value })} /></label>
      <label><span className="mb-1 block text-sm font-bold text-text-main/60">תאריך לידה</span><input className="field" type="date" value={baby.birthDate} onChange={(e) => onBaby({ ...baby, birthDate: e.target.value })} /></label>
      <div className="grid grid-cols-2 gap-3">
        <label><span className="mb-1 block text-sm font-bold text-text-main/60">לילה מתחיל</span><input className="field" type="time" value={settings.nightStart} onChange={(e) => onSettings({ ...settings, nightStart: e.target.value })} /></label>
        <label><span className="mb-1 block text-sm font-bold text-text-main/60">לילה מסתיים</span><input className="field" type="time" value={settings.nightEnd} onChange={(e) => onSettings({ ...settings, nightEnd: e.target.value })} /></label>
      </div>
      <select className="field" value={settings.themeMode} onChange={(e) => onSettings({ ...settings, themeMode: e.target.value as AppSettings['themeMode'] })}>
        <option value="auto">אוטומטי</option><option value="light">בהיר</option><option value="dark">כהה</option>
      </select>
    </div>
    <Button className="w-full" variant="secondary" onClick={exportJson}>ייצוא נתונים כ־JSON</Button>
    <Button className="w-full" variant="danger" onClick={onReset}>איפוס כל הנתונים</Button>
  </section>;
}
