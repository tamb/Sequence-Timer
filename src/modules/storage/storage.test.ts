import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import * as state from '../state/state';
import {
  clearSavedSets,
  loadSavedSets,
  loadTimerSet,
  saveTimerSet,
  saveSettings,
  loadSettings,
} from './storage';
import { storageService } from './storage-service';
import { updateTimerList } from '../ui/ui';

vi.mock('./storage-service');
vi.mock('../ui/ui');

describe('storage', () => {
  let timerSetNameInput: HTMLInputElement;
  let savedSetsSelect: HTMLSelectElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="timer-set-name-input" />
      <select id="saved-sets-select"></select>
    `;
    timerSetNameInput = document.getElementById(
      'timer-set-name-input',
    ) as HTMLInputElement;
    savedSetsSelect = document.getElementById(
      'saved-sets-select',
    ) as HTMLSelectElement;

    vi.clearAllMocks();
    state.timers.length = 0;
    state.updateSettings({
      vibration: true,
      haptics: true,
      alarmVolume: 10,
      interruptPlayback: true,
      alarmNotifications: true,
    });
    (storageService.keys as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (storageService.getItem as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    (storageService.setItem as ReturnType<typeof vi.fn>).mockClear();
    (storageService.removeItem as ReturnType<typeof vi.fn>).mockClear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('settings', () => {
    test('should save and load settings', async () => {
      const newSettings: state.TSettings = {
        vibration: false,
        haptics: false,
        alarmVolume: 5,
        interruptPlayback: false,
        alarmNotifications: false,
      };
      state.updateSettings(newSettings);

      await saveSettings();
      expect(storageService.setItem).toHaveBeenCalledWith('app_settings', newSettings);

      (storageService.getItem as ReturnType<typeof vi.fn>).mockResolvedValue(
        newSettings,
      );
      await loadSettings();
      expect(state.settings).toEqual(newSettings);
    });
  });

  describe('timer sets', () => {
    test('should save a timer set', async () => {
      const newTimers: state.TTimer[] = [
        { id: '1', label: 'Work', hours: 0, minutes: 25, seconds: 0, ms: 0 },
        { id: '2', label: 'Break', hours: 0, minutes: 5, seconds: 0, ms: 0 },
      ];
      state.timers.push(...newTimers);
      timerSetNameInput.value = 'MySet';

      await saveTimerSet(timerSetNameInput);
      expect(storageService.setItem).toHaveBeenCalledWith('MySet', newTimers);
    });

    test('should load a timer set', async () => {
      const storedTimers: state.TTimer[] = [
        { id: '1', label: 'Work', hours: 0, minutes: 25, seconds: 0, ms: 0 },
      ];
      (storageService.getItem as ReturnType<typeof vi.fn>).mockResolvedValue(
        storedTimers,
      );
      savedSetsSelect.innerHTML = '<option value="MySet">MySet</option>';
      savedSetsSelect.value = 'MySet';

      await loadTimerSet(savedSetsSelect);
      expect(state.timers).toEqual(storedTimers);
      expect(updateTimerList).toHaveBeenCalled();
    });

    test('should load saved set names', async () => {
      (storageService.keys as ReturnType<typeof vi.fn>).mockResolvedValue([
        'MySet1',
        'MySet2',
        'app_settings',
      ]);
      await loadSavedSets(savedSetsSelect);
      expect(savedSetsSelect.innerHTML).toContain(
        '<option value="MySet1">MySet1</option>',
      );
      expect(savedSetsSelect.innerHTML).toContain(
        '<option value="MySet2">MySet2</option>',
      );
      expect(savedSetsSelect.innerHTML).not.toContain('app_settings');
    });

    test('should clear all sets except settings', async () => {
      (storageService.keys as ReturnType<typeof vi.fn>).mockResolvedValue([
        'MySet1',
        'MySet2',
        'app_settings',
      ]);
      await clearSavedSets();
      expect(storageService.removeItem).toHaveBeenCalledWith('MySet1');
      expect(storageService.removeItem).toHaveBeenCalledWith('MySet2');
      expect(storageService.removeItem).not.toHaveBeenCalledWith('app_settings');
    });
  });
});
