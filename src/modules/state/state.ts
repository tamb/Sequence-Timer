/**
 * @file Manages the application's state, including timers and settings.
 */

/**
 * Represents a single timer with its properties.
 * @typedef {object} TTimer
 * @property {string} id - A unique identifier for the timer.
 * @property {string} label - A descriptive label for the timer.
 * @property {number} hours - The hours component of the timer's duration.
 * @property {number} minutes - The minutes component of the timer's duration.
 * @property {number} seconds - The seconds component of the timer's duration.
 * @property {number} ms - The milliseconds component of the timer's duration.
 */
export type TTimer = {
  id: string;
  label: string;
  hours: number;
  minutes: number;
  seconds: number;
  ms: number;
};

/**
 * Represents the application's settings.
 * @typedef {object} TSettings
 * @property {boolean} vibration - Whether to enable vibration for alarms.
 * @property {boolean} haptics - Whether to enable haptic feedback for user interactions.
 * @property {number} alarmVolume - The volume of the alarm sound (0-10).
 * @property {boolean} interruptPlayback - Whether the alarm should interrupt other media playback.
 * @property {boolean} alarmNotifications - Whether to show notifications for alarms.
 */
export type TSettings = {
  vibration: boolean;
  haptics: boolean;
  alarmVolume: number;
  interruptPlayback: boolean;
  alarmNotifications: boolean;
};

/**
 * An array of timer objects representing the current sequence.
 * @type {TTimer[]}
 */
export const timers: TTimer[] = [];

/**
 * The application's current settings.
 * @type {TSettings}
 */
export let settings: TSettings = {
  vibration: true,
  haptics: true,
  alarmVolume: 10,
  interruptPlayback: true,
  alarmNotifications: true,
};

/**
 * Updates the application's settings with new values.
 * @param {Partial<TSettings>} newSettings - An object containing the settings to update.
 */
export function updateSettings(newSettings: Partial<TSettings>) {
  settings = { ...settings, ...newSettings };
}

/**
 * Represents the state of the timer.
 * @typedef {object} TState
 * @property {number} currentTimerIndex - The index of the currently running timer.
 * @property {boolean} isTimerRunning - Whether the timer is currently running.
 * @property {boolean} isPaused - Whether the timer is currently paused.
 * @property {number} remainingTime - The remaining time of the current timer.
 * @property {ReturnType<typeof setInterval> | undefined} timerInterval - The interval ID for the timer.
 */
export type TState = {
  currentTimerIndex: number;
  isTimerRunning: boolean;
  isPaused: boolean;
  remainingTime: number;
  timerInterval: ReturnType<typeof setInterval> | undefined;
};

/**
 * The application's current state.
 * @type {TState}
 */
export const state: TState = {
  currentTimerIndex: -1,
  isTimerRunning: false,
  isPaused: false,
  remainingTime: 0,
  timerInterval: undefined,
};
