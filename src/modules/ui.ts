import { timers } from "./state";
import type { Timer } from "./state";

export const timerList = document.getElementById(
  "timerList",
) as HTMLUListElement;
export const startButton = document.getElementById(
  "startButton",
) as HTMLButtonElement;
export const pauseResumeButton = document.getElementById(
  "pauseResumeButton",
) as HTMLButtonElement;
export const stopButton = document.getElementById(
  "stopButton",
) as HTMLButtonElement;
export const currentTimerDisplay = document.getElementById(
  "currentTimer",
) as HTMLDivElement;

export function updateTimerList() {
  timerList.innerHTML = "";
  timers.forEach((timer, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.dataset.id = timer.id;
    li.innerHTML = `
            <div class="d-flex justify-content-between align-items-center timer-display">
                <span>${timer.label} (${timer.hours}h ${timer.minutes}m ${
      timer.seconds
    }s)</span>
                <div>
                    <button class="btn btn-secondary btn-sm" onclick="editTimer(${index})" aria-label="Edit Timer"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTimer(${index})" aria-label="Delete Timer"><i class="bi bi-trash-fill"></i></button>
                </div>
            </div>
            <div class="timer-edit">
                <input type="text" class="form-control mb-1" value="${
                  timer.label
                }" id="editLabel-${index}">
                <div class="input-group mb-1">
                    <input type="number" class="form-control" value="${
                      timer.hours
                    }" id="editHours-${index}" placeholder="HH">
                    <input type="number" class="form-control" value="${
                      timer.minutes
                    }" id="editMinutes-${index}" placeholder="MM">
                    <input type="number" class="form-control" value="${
                      timer.seconds
                    }" id="editSeconds-${index}" placeholder="SS">
                </div>
                <div class="btn-group w-100">
                    <button class="btn btn-success" onclick="saveTimer(${index})" aria-label="Save Timer"><i class="bi bi-check-lg"></i></button>
                    <button class="btn btn-secondary" onclick="cancelEdit(${index})" aria-label="Cancel Edit"><i class="bi bi-x-lg"></i></button>
                </div>
            </div>
        `;
    timerList.appendChild(li);
  });
} 