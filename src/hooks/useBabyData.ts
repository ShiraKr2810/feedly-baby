import { useEffect, useState } from 'react';
import { BabyData } from '../types';
import { defaultSettings, storageService } from '../services/storageService';

export function useBabyData() {
  const [data, setData] = useState<BabyData>(() => ({
    baby: storageService.loadBaby(),
    feedings: storageService.loadFeedings(),
    pumping: storageService.loadPumping(),
    bottles: storageService.loadBottles(),
    diapers: storageService.loadDiapers(),
    reminders: storageService.loadReminders(),
    settings: { ...defaultSettings, ...storageService.loadSettings() },
  }));

  useEffect(() => storageService.saveBaby(data.baby), [data.baby]);
  useEffect(() => storageService.saveFeedings(data.feedings), [data.feedings]);
  useEffect(() => storageService.savePumping(data.pumping), [data.pumping]);
  useEffect(() => storageService.saveBottles(data.bottles), [data.bottles]);
  useEffect(() => storageService.saveDiapers(data.diapers), [data.diapers]);
  useEffect(() => storageService.saveReminders(data.reminders), [data.reminders]);
  useEffect(() => storageService.saveSettings(data.settings), [data.settings]);

  return { data, setData };
}
