import { timers } from "./state";
import {
  startButton,
  pauseResumeButton,
  stopButton,
  currentTimerDisplay,
  timerList,
} from "./ui";
import { playAlarm } from "./audio";

let currentTimerIndex = -1;
let timerInterval: number | undefined;
let isPaused = false;
let remainingTime = 0;

export function startTimers() {
  if (timers.length > 0) {
    currentTimerIndex = 0;
    runTimer(currentTimerIndex);
    startButton.style.display = "none";
    pauseResumeButton.style.display = "inline-block";
    stopButton.style.display = "inline-block";
  }
}

export function pauseResumeTimer() {
  isPaused = !isPaused;
  if (isPaused) {
    clearInterval(timerInterval);
    pauseResumeButton.textContent = "Resume";
  } else {
    runTimer(currentTimerIndex, remainingTime);
    pauseResumeButton.textContent = "Pause";
  }
}

export function stopTimers() {
  clearInterval(timerInterval);
  currentTimerIndex = -1;
  currentTimerDisplay.textContent = "Done!";
  startButton.style.display = "inline-block";
  pauseResumeButton.style.display = "none";
  stopButton.style.display = "none";

  // Remove active class from all timers
  const timerItems = timerList.querySelectorAll(".list-group-item");
  timerItems.forEach((item) => item.classList.remove("active-timer"));
}

function runTimer(index: number, startFrom?: number) {
  // Add active class to the current timer
  const timerItems = timerList.querySelectorAll(".list-group-item");
  timerItems.forEach((item, i) => {
    if (i === index) {
      item.classList.add("active-timer");
    } else {
      item.classList.remove("active-timer");
    }
  });

  const timer = timers[index];
  let totalMs =
    startFrom ||
    timer.hours * 3600000 +
      timer.minutes * 60000 +
      timer.seconds * 1000 +
      timer.ms;

  currentTimerDisplay.textContent = "";

  const updateDisplay = () => {
    remainingTime = totalMs;
    const h = Math.floor(totalMs / 3600000);
    const m = Math.floor((totalMs % 3600000) / 60000);
    const s = Math.floor((totalMs % 60000) / 1000);
    currentTimerDisplay.textContent = `${timer.label}: ${h}h ${m}m ${s}s`;
  };

  updateDisplay();

  timerInterval = setInterval(() => {
    totalMs -= 1000;
    updateDisplay();
    if (totalMs <= 0) {
      clearInterval(timerInterval);
      playAlarm();
      currentTimerIndex++;
      if (currentTimerIndex < timers.length) {
        runTimer(currentTimerIndex);
      } else {
        stopTimers();
      }
    }
  }, 1000);
} 