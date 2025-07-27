/**
 * @file Manages saving and loading data using localforage.
 */
import { settings, timers, updateSettings } from "../state/state";
import { updateTimerList } from "../ui/ui";
import type { TTimer, TSettings } from "../state/state";
import { storageService } from "./storage-service";

const SETTINGS_KEY = "app_settings";

/**
 * Saves the current settings to storage.
 */
export async function saveSettings() {
  await storageService.setItem(SETTINGS_KEY, settings);
}

/**
 * Loads the settings from storage and applies them.
 */
export async function loadSettings() {
  const loadedSettings = await storageService.getItem<TSettings>(SETTINGS_KEY);
  if (loadedSettings) {
    updateSettings(loadedSettings);
  }
}

/**
 * Saves the current timer sequence as a named set.
 */
export async function saveTimerSet(timerSetNameInput: HTMLInputElement) {
  const setName = timerSetNameInput.value;
  if (setName) {
    await storageService.setItem(setName, timers);
  }
}

/**
 * Loads the names of all saved timer sets and populates the dropdown.
 */
export async function loadSavedSets(savedSetsSelect: HTMLSelectElement) {
  const keys = await storageService.keys();
  savedSetsSelect.innerHTML = "";
  keys.forEach((key) => {
    if (key !== SETTINGS_KEY) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = key;
      savedSetsSelect.add(option);
    }
  });
}

/**
 * Loads a selected timer set and updates the current timer sequence.
 */
export async function loadTimerSet(savedSetsSelect: HTMLSelectElement) {
  const setName = savedSetsSelect.value;
  if (setName) {
    const loadedTimers = await storageService.getItem<TTimer[]>(setName);
    if (loadedTimers) {
      timers.length = 0;
      timers.push(...loadedTimers);
      updateTimerList();
    }
  }
}

/**
 * Clears all saved timer sets from storage.
 */
export async function clearSavedSets() {
  const keys = await storageService.keys();
  for (const key of keys) {
    if (key !== SETTINGS_KEY) {
      await storageService.removeItem(key);
    }
  }
}
