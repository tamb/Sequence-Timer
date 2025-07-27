/**
 * @file This is the main entry point for the application. It initializes the application and sets up event listeners.
 */
import "./index.scss";
import Sortable from "sortablejs";
import { Tooltip } from "bootstrap";
import { initializeSettings } from "./modules/settings/settings";
import { timers } from "./modules/state/state";
import { timerList, updateTimerList as renderTimers } from "./modules/ui/ui";
import { Audio } from "./modules/audio/audio";
import { Alarm } from "./modules/alarm/alarm";
import {
  saveTimerSet,
  loadSavedSets,
  loadTimerSet as loadTimerSetFromStorage,
  clearSavedSets,
  loadSettings,
} from "./modules/storage/storage";
import { audio, startTimers, pauseResumeTimer, stopTimers } from "./modules/timer/timer";
import { performHapticFeedback } from "./modules/settings/settings";

const alarm = new Alarm(new Audio());
let testAlarmButton: HTMLButtonElement;
let testAlarmIcon: HTMLElement;
let timerLabelInput: HTMLInputElement;
let timerHoursInput: HTMLInputElement;
let timerMinutesInput: HTMLInputElement;
let timerSecondsInput: HTMLInputElement;
let timerMsInput: HTMLInputElement;
let addTimerButton: HTMLButtonElement;
let resetButton: HTMLButtonElement;
let startButton: HTMLButtonElement;
let pauseResumeButton: HTMLButtonElement;
let stopButton: HTMLButtonElement;
let saveTimerSetButton: HTMLButtonElement;
let loadTimerSetButton: HTMLButtonElement;
let clearSavedSetsButton: HTMLButtonElement;
let timerSetNameInput: HTMLInputElement;
let savedSetsSelect: HTMLSelectElement;

/**
 * Toggles the test alarm on and off.
 */
async function toggleAlarm() {
  performHapticFeedback();
  if (alarm.isPlaying()) {
    await alarm.stop();
    testAlarmIcon.classList.remove("bi-stop-fill");
    testAlarmIcon.classList.add("bi-bell-fill");
  } else {
    await alarm.play();
    testAlarmIcon.classList.remove("bi-bell-fill");
    testAlarmIcon.classList.add("bi-stop-fill");
  }
}

/**
 * Adds a new timer to the sequence.
 */
function addTimer() {
  performHapticFeedback();
  const label = timerLabelInput.value;
  const hours = parseInt(timerHoursInput.value) || 0;
  const minutes = parseInt(timerMinutesInput.value) || 0;
  const seconds = parseInt(timerSecondsInput.value) || 0;
  const ms = parseInt(timerMsInput.value) || 0;

  timers.push({
    id: `timer-${Date.now()}`,
    label,
    hours,
    minutes,
    seconds,
    ms,
  });
  renderTimers();
}

/**
 * Puts a timer into editing mode.
 * @param {number} index - The index of the timer to edit.
 */
export function editTimer(index: number) {
  performHapticFeedback();
  const li = timerList.children[index] as HTMLLIElement;
  li.classList.add("editing");
}

/**
 * Cancels editing a timer.
 * @param {number} index - The index of the timer to cancel editing.
 */
export function cancelEdit(index: number) {
  performHapticFeedback();
  const li = timerList.children[index] as HTMLLIElement;
  li.classList.remove("editing");
}

/**
 * Saves the changes to a timer.
 * @param {number} index - The index of the timer to save.
 */
export function saveTimer(index: number) {
  performHapticFeedback();
  const label = (
    timerList.children[index].querySelector('[data-ref="edit-label-input"]') as HTMLInputElement
  ).value;
  const hours = parseInt(
    (timerList.children[index].querySelector('[data-ref="edit-hours-input"]') as HTMLInputElement)
      .value,
  );
  const minutes = parseInt(
    (timerList.children[index].querySelector('[data-ref="edit-minutes-input"]') as HTMLInputElement)
      .value,
  );
  const seconds = parseInt(
    (timerList.children[index].querySelector('[data-ref="edit-seconds-input"]') as HTMLInputElement)
      .value,
  );

  timers[index] = { ...timers[index], label, hours, minutes, seconds };
  renderTimers();
}

/**
 * Deletes a timer from the sequence.
 * @param {number} index - The index of the timer to delete.
 */
export function deleteTimer(index: number) {
  performHapticFeedback();
  timers.splice(index, 1);
  renderTimers();
}

/**
 * Resets the timer sequence.
 */
function resetTimers() {
  performHapticFeedback();
  stopTimers();
  timers.splice(0, timers.length);
  renderTimers();
}

/**
 * Initializes the application.
 */
async function initializeApp() {
  try {
    await loadSettings();
    initializeSettings();
    timerLabelInput = document.querySelector('[data-ref="timer-label-input"]') as HTMLInputElement;
    timerHoursInput = document.querySelector('[data-ref="timer-hours-input"]') as HTMLInputElement;
    timerMinutesInput = document.querySelector(
      '[data-ref="timer-minutes-input"]',
    ) as HTMLInputElement;
    timerSecondsInput = document.querySelector(
      '[data-ref="timer-seconds-input"]',
    ) as HTMLInputElement;
    timerMsInput = document.querySelector('[data-ref="timer-ms-input"]') as HTMLInputElement;
    addTimerButton = document.querySelector('[data-ref="add-timer-button"]') as HTMLButtonElement;
    resetButton = document.querySelector('[data-ref="reset-button"]') as HTMLButtonElement;
    startButton = document.querySelector('[data-ref="start-button"]') as HTMLButtonElement;
    pauseResumeButton = document.querySelector(
      '[data-ref="pause-resume-button"]',
    ) as HTMLButtonElement;
    stopButton = document.querySelector('[data-ref="stop-button"]') as HTMLButtonElement;
    saveTimerSetButton = document.querySelector(
      '[data-ref="save-timer-set-button"]',
    ) as HTMLButtonElement;
    loadTimerSetButton = document.querySelector(
      '[data-ref="load-timer-set-button"]',
    ) as HTMLButtonElement;
    clearSavedSetsButton = document.querySelector(
      '[data-ref="clear-saved-sets-button"]',
    ) as HTMLButtonElement;
    testAlarmButton = document.querySelector('[data-ref="test-alarm-button"]') as HTMLButtonElement;
    testAlarmIcon = testAlarmButton.querySelector("i") as HTMLElement;
    timerSetNameInput = document.querySelector(
      '[data-ref="timer-set-name-input"]',
    ) as HTMLInputElement;
    savedSetsSelect = document.querySelector(
      '[data-ref="saved-sets-select"]',
    ) as HTMLSelectElement;

    await loadSavedSets(savedSetsSelect);
    renderTimers();
    await audio.initialize();

    testAlarmButton.addEventListener("click", toggleAlarm);
    addTimerButton.addEventListener("click", addTimer);
    resetButton.addEventListener("click", resetTimers);
    startButton.addEventListener("click", () => {
      performHapticFeedback();
      startTimers();
    });
    pauseResumeButton.addEventListener("click", () => {
      performHapticFeedback();
      pauseResumeTimer();
    });
    stopButton.addEventListener("click", () => {
      performHapticFeedback();
      stopTimers();
    });
    saveTimerSetButton.addEventListener("click", async () => {
      performHapticFeedback();
      await saveTimerSet(timerSetNameInput);
      await loadSavedSets(savedSetsSelect);
    });
    loadTimerSetButton.addEventListener("click", async () => {
      performHapticFeedback();
      await loadTimerSetFromStorage(savedSetsSelect);
      renderTimers();
    });
    clearSavedSetsButton.addEventListener("click", async () => {
      performHapticFeedback();
      await clearSavedSets();
      await loadSavedSets(savedSetsSelect);
    });

    // Initialize Sortable
    new Sortable(timerList, {
      animation: 150,
      ghostClass: "blue-background-class",
      onEnd: (evt) => {
        // Reorder the timers array when a timer is dragged and dropped.
        if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
          const element = timers.splice(evt.oldIndex, 1)[0];
          timers.splice(evt.newIndex, 0, element);
        }
      },
    });

    // Initialize tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));
  } catch (error) {
    console.error("Error during initialization:", error);
  }
}

/**
 * Expose functions to the global window object so they can be called from the HTML.
 * This is necessary because the script is loaded as a module.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
 */
document.addEventListener("DOMContentLoaded", initializeApp);

window.addEventListener("beforeunload", () => {
  audio.destroy();
});
