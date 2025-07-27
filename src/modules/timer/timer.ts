/**
 * @file Manages the timer logic, including starting, pausing, and stopping timers.
 */
import { timers, state } from "../state/state";
import { updateTimerList } from "../ui/ui";
import { Audio } from "../audio/audio";
import { Alarm } from "../alarm/alarm";

export const audio = new Audio();
const alarm = new Alarm(audio);

/**
 * Starts the timer sequence.
 */
export function startTimers() {
  if (timers.length > 0) {
    state.currentTimerIndex = 0;
    runTimer(state.currentTimerIndex);
    state.isTimerRunning = true;
    updateTimerList();
  }
}

/**
 * Pauses or resumes the currently running timer.
 */
export function pauseResumeTimer() {
  state.isPaused = !state.isPaused;
  if (state.isPaused) {
    clearInterval(state.timerInterval);
  } else {
    runTimer(state.currentTimerIndex, state.remainingTime);
  }
  updateTimerList();
}

/**
 * Stops the currently running timer and resets the timer sequence.
 */
export function stopTimers() {
  clearInterval(state.timerInterval);
  state.currentTimerIndex = -1;
  state.isTimerRunning = false;
  state.isPaused = false;
  updateTimerList();
}

/**
 * Runs a timer at a specific index in the `timers` array.
 * @param {number} index - The index of the timer to run.
 * @param {number} [startFrom] - The time in milliseconds to start the timer from.
 */
function runTimer(index: number, startFrom?: number) {
  const timer = timers[index];
  let totalMs =
    startFrom || timer.hours * 3600000 + timer.minutes * 60000 + timer.seconds * 1000 + timer.ms;

  state.remainingTime = totalMs;
  updateTimerList();

  state.timerInterval = setInterval(() => {
    totalMs -= 1000;
    state.remainingTime = totalMs;
    updateTimerList();
    if (totalMs <= 0) {
      clearInterval(state.timerInterval);
      alarm.play();
      // Move to the next timer
      state.currentTimerIndex++;
      if (state.currentTimerIndex < timers.length) {
        runTimer(state.currentTimerIndex);
      } else {
        // All timers have completed
        stopTimers();
      }
    }
  }, 1000);
}
