import Sortable from "sortablejs";
import { timers } from "./modules/state";
import { timerList, updateTimerList as renderTimers } from "./modules/ui";
import { testAlarm } from "./modules/audio";
import {
  saveTimerSet,
  loadSavedSets,
  loadTimerSet as loadTimerSetFromStorage,
  clearSavedSets,
} from "./modules/storage";
import {
  startTimers,
  pauseResumeTimer,
  stopTimers,
} from "./modules/timer";

// Initialize tooltips
const tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]'),
);
tooltipTriggerList.map(
  (tooltipTriggerEl) => new (window as any).bootstrap.Tooltip(tooltipTriggerEl),
);

function addTimer() {
  const label = (
    document.getElementById("timerLabel") as HTMLInputElement
  ).value;
  const hours =
    parseInt(
      (document.getElementById("timerHours") as HTMLInputElement).value,
    ) || 0;
  const minutes =
    parseInt(
      (document.getElementById("timerMinutes") as HTMLInputElement).value,
    ) || 0;
  const seconds =
    parseInt(
      (document.getElementById("timerSeconds") as HTMLInputElement).value,
    ) || 0;
  const ms =
    parseInt((document.getElementById("timerMs") as HTMLInputElement).value) ||
    0;

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

function editTimer(index: number) {
  const li = timerList.children[index] as HTMLLIElement;
  li.classList.add("editing");
}

function cancelEdit(index: number) {
  const li = timerList.children[index] as HTMLLIElement;
  li.classList.remove("editing");
}

function saveTimer(index: number) {
  const label = (
    document.getElementById(`editLabel-${index}`) as HTMLInputElement
  ).value;
  const hours = parseInt(
    (document.getElementById(`editHours-${index}`) as HTMLInputElement).value,
  );
  const minutes = parseInt(
    (document.getElementById(`editMinutes-${index}`) as HTMLInputElement).value,
  );
  const seconds = parseInt(
    (document.getElementById(`editSeconds-${index}`) as HTMLInputElement).value,
  );

  timers[index] = { ...timers[index], label, hours, minutes, seconds };
  renderTimers();
}

function deleteTimer(index: number) {
  timers.splice(index, 1);
  renderTimers();
}

function resetTimers() {
  stopTimers();
  timers.splice(0, timers.length);
  renderTimers();
}

async function initializeApp() {
  await loadSavedSets();
  renderTimers();
}

new Sortable(timerList, {
  animation: 150,
  onEnd: function (evt) {
    const element = timers.splice(evt.oldIndex!, 1)[0];
    timers.splice(evt.newIndex!, 0, element);
  },
});

Object.assign(window, {
  addTimer,
  editTimer,
  cancelEdit,
  saveTimer,
  deleteTimer,
  startTimers,
  pauseResumeTimer,
  stopTimers,
  resetTimers,
  testAlarm,
  saveTimerSet,
  loadTimerSet: async () => {
    await loadTimerSetFromStorage();
    renderTimers();
  },
  clearSavedSets,
});

initializeApp();