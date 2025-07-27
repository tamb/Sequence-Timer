/**
 * @file Manages the user interface, including rendering the timer list and handling DOM elements.
 */
import { timers } from "../state/state";
import { editTimer, deleteTimer, saveTimer, cancelEdit } from "../../index";

/**
 * Gets the DOM elements needed for the UI.
 * @returns An object containing the DOM elements.
 */
function getDOMElements() {
  return {
    timerList: document.querySelector('[data-ref="timer-list"]') as HTMLUListElement,
    startButton: document.querySelector('[data-ref="start-button"]') as HTMLButtonElement,
    pauseResumeButton: document.querySelector('[data-ref="pause-resume-button"]') as HTMLButtonElement,
    stopButton: document.querySelector('[data-ref="stop-button"]') as HTMLButtonElement,
    currentTimerDisplay: document.querySelector('[data-ref="current-timer-display"]') as HTMLDivElement,
  };
}

/**
 * Renders the timer list in the UI.
 * This function clears the existing list and re-renders it from the `timers` state.
 * It also sets up the HTML structure for displaying and editing each timer.
 */
export function updateTimerList() {
  const { timerList } = getDOMElements();
  if (!timerList) {
    console.error('Timer list element not found');
    return;
  }

  // Clear the list to prevent duplicates
  timerList.innerHTML = "";
  timers.forEach((timer, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.dataset.id = timer.id;
    li.innerHTML = `
            <div class="d-flex justify-content-between align-items-center timer-display">
                <span>${timer.label} (${timer.hours}h ${timer.minutes}m ${timer.seconds}s)</span>
                <div>
                    <button class="btn btn-secondary btn-sm" data-ref="edit-button" aria-label="Edit Timer"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-danger btn-sm" data-ref="delete-button" aria-label="Delete Timer"><i class="bi bi-trash-fill"></i></button>
                </div>
            </div>
            <div class="timer-edit">
                <input type="text" class="form-control mb-1" value="${timer.label}" data-ref="edit-label-input">
                <div class="input-group mb-1">
                    <input type="number" class="form-control" value="${timer.hours}" data-ref="edit-hours-input" placeholder="HH">
                    <input type="number" class="form-control" value="${timer.minutes}" data-ref="edit-minutes-input" placeholder="MM">
                    <input type="number" class="form-control" value="${timer.seconds}" data-ref="edit-seconds-input" placeholder="SS">
                </div>
                <div class="btn-group w-100">
                    <button class="btn btn-success" data-ref="save-button" aria-label="Save Timer"><i class="bi bi-check-lg"></i></button>
                    <button class="btn btn-secondary" data-ref="cancel-button" aria-label="Cancel Edit"><i class="bi bi-x-lg"></i></button>
                </div>
            </div>
        `;
    timerList.appendChild(li);

    const editButton = li.querySelector('[data-ref="edit-button"]');
    if (editButton) {
      editButton.addEventListener("click", () => editTimer(index));
    }

    const deleteButton = li.querySelector('[data-ref="delete-button"]');
    if (deleteButton) {
      deleteButton.addEventListener("click", () => deleteTimer(index));
    }

    const saveButton = li.querySelector('[data-ref="save-button"]');
    if (saveButton) {
      saveButton.addEventListener("click", () => saveTimer(index));
    }

    const cancelButton = li.querySelector('[data-ref="cancel-button"]');
    if (cancelButton) {
      cancelButton.addEventListener("click", () => cancelEdit(index));
    }
  });
}

// Export DOM elements getter for testing
export const getUIElements = getDOMElements;
