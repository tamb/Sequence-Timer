import { describe, it, expect, beforeEach, vi } from 'vitest';
import { updateTimerList, getUIElements } from './ui';
import { timers } from '../state/state';
import * as index from '../../index';

// Mock the index module functions
vi.mock('../../index', () => ({
  editTimer: vi.fn(),
  deleteTimer: vi.fn(),
  saveTimer: vi.fn(),
  cancelEdit: vi.fn(),
}));

describe('UI Module', () => {
  // Set up the DOM elements before each test
  beforeEach(() => {
    // Clear the timers array
    timers.length = 0;
    
    // Reset the document body
    document.body.innerHTML = `
      <ul data-ref="timer-list"></ul>
      <button data-ref="start-button"></button>
      <button data-ref="pause-resume-button" style="display: none;"></button>
      <button data-ref="stop-button" style="display: none;"></button>
      <div data-ref="current-timer-display">No timer running.</div>
    `;
  });

  it('should render an empty list when there are no timers', () => {
    updateTimerList();
    const { timerList } = getUIElements();
    expect(timerList?.children.length).toBe(0);
  });

  it('should render timer items correctly', () => {
    // Add a test timer
    timers.push({
      id: '1',
      label: 'Test Timer',
      hours: 1,
      minutes: 30,
      seconds: 0,
    });

    updateTimerList();
    const { timerList } = getUIElements();

    expect(timerList?.children.length).toBe(1);
    const timerItem = timerList?.children[0];
    
    // Check if the timer display shows correct information
    const displayText = timerItem?.querySelector('.timer-display span')?.textContent;
    expect(displayText).toBe('Test Timer (1h 30m 0s)');
    
    // Check if the timer has edit and delete buttons
    expect(timerItem?.querySelector('[data-ref="edit-button"]')).toBeTruthy();
    expect(timerItem?.querySelector('[data-ref="delete-button"]')).toBeTruthy();
  });

  it('should call editTimer when edit button is clicked', () => {
    timers.push({
      id: '1',
      label: 'Test Timer',
      hours: 1,
      minutes: 30,
      seconds: 0,
    });

    updateTimerList();
    const { timerList } = getUIElements();

    const editButton = timerList?.querySelector('[data-ref="edit-button"]');
    editButton?.dispatchEvent(new MouseEvent('click'));

    expect(index.editTimer).toHaveBeenCalledWith(0);
  });

  it('should call deleteTimer when delete button is clicked', () => {
    timers.push({
      id: '1',
      label: 'Test Timer',
      hours: 1,
      minutes: 30,
      seconds: 0,
    });

    updateTimerList();
    const { timerList } = getUIElements();

    const deleteButton = timerList?.querySelector('[data-ref="delete-button"]');
    deleteButton?.dispatchEvent(new MouseEvent('click'));

    expect(index.deleteTimer).toHaveBeenCalledWith(0);
  });

  it('should render multiple timers in order', () => {
    timers.push(
      {
        id: '1',
        label: 'Timer 1',
        hours: 1,
        minutes: 0,
        seconds: 0,
      },
      {
        id: '2',
        label: 'Timer 2',
        hours: 0,
        minutes: 30,
        seconds: 0,
      }
    );

    updateTimerList();
    const { timerList } = getUIElements();

    expect(timerList?.children.length).toBe(2);
    expect(timerList?.children[0].querySelector('.timer-display span')?.textContent)
      .toBe('Timer 1 (1h 0m 0s)');
    expect(timerList?.children[1].querySelector('.timer-display span')?.textContent)
      .toBe('Timer 2 (0h 30m 0s)');
  });

  it('should render edit form with correct values', () => {
    timers.push({
      id: '1',
      label: 'Test Timer',
      hours: 2,
      minutes: 15,
      seconds: 30,
    });

    updateTimerList();
    const { timerList } = getUIElements();
    const timerItem = timerList?.children[0];

    const labelInput = timerItem?.querySelector('[data-ref="edit-label-input"]') as HTMLInputElement;
    const hoursInput = timerItem?.querySelector('[data-ref="edit-hours-input"]') as HTMLInputElement;
    const minutesInput = timerItem?.querySelector('[data-ref="edit-minutes-input"]') as HTMLInputElement;
    const secondsInput = timerItem?.querySelector('[data-ref="edit-seconds-input"]') as HTMLInputElement;

    expect(labelInput?.value).toBe('Test Timer');
    expect(hoursInput?.value).toBe('2');
    expect(minutesInput?.value).toBe('15');
    expect(secondsInput?.value).toBe('30');
  });

  it('should call saveTimer when save button is clicked', () => {
    timers.push({
      id: '1',
      label: 'Test Timer',
      hours: 1,
      minutes: 30,
      seconds: 0,
    });

    updateTimerList();
    const { timerList } = getUIElements();

    const saveButton = timerList?.querySelector('[data-ref="save-button"]');
    saveButton?.dispatchEvent(new MouseEvent('click'));

    expect(index.saveTimer).toHaveBeenCalledWith(0);
  });

  it('should call cancelEdit when cancel button is clicked', () => {
    timers.push({
      id: '1',
      label: 'Test Timer',
      hours: 1,
      minutes: 30,
      seconds: 0,
    });

    updateTimerList();
    const { timerList } = getUIElements();

    const cancelButton = timerList?.querySelector('[data-ref="cancel-button"]');
    cancelButton?.dispatchEvent(new MouseEvent('click'));

    expect(index.cancelEdit).toHaveBeenCalledWith(0);
  });
}); 