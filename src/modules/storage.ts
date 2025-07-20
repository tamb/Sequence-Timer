import * as localforage from "localforage";
import { timers } from "./state";
import type { Timer } from "./state";

export async function saveTimerSet() {
  const setName = (
    document.getElementById("timerSetName") as HTMLInputElement
  ).value;
  if (setName) {
    await localforage.setItem(setName, timers);
    loadSavedSets();
  }
}

export async function loadSavedSets() {
  const savedSetsSelect = document.getElementById(
    "savedSets",
  ) as HTMLSelectElement;
  savedSetsSelect.innerHTML = "";
  const keys = await localforage.keys();
  keys.forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    savedSetsSelect.appendChild(option);
  });
}

export async function loadTimerSet() {
  const setName = (
    document.getElementById("savedSets") as HTMLSelectElement
  ).value;
  if (setName) {
    const loadedTimers = await localforage.getItem<Timer[]>(setName);
    if (loadedTimers) {
      timers.splice(0, timers.length, ...loadedTimers);
    }
  }
}

export async function clearSavedSets() {
  await localforage.clear();
  loadSavedSets();
} 