/**
 * @file Manages the settings UI and functionality.
 */
import { settings, updateSettings } from "../state/state";
import { saveSettings } from "../storage/storage";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

/**
 * Initializes the settings UI, including setting initial values and adding event listeners.
 */
export function initializeSettings() {
  const vibrationToggle = document.getElementById("vibrationToggle") as HTMLInputElement;
  const hapticsToggle = document.getElementById("hapticsToggle") as HTMLInputElement;
  const alarmVolumeRange = document.getElementById("alarmVolumeRange") as HTMLInputElement;
  const interruptPlaybackToggle = document.getElementById(
    "interruptPlaybackToggle",
  ) as HTMLInputElement;
  const alarmNotificationsToggle = document.getElementById(
    "alarmNotificationsToggle",
  ) as HTMLInputElement;

  // Set initial state from loaded settings
  vibrationToggle.checked = settings.vibration;
  hapticsToggle.checked = settings.haptics;
  alarmVolumeRange.value = settings.alarmVolume.toString();
  interruptPlaybackToggle.checked = settings.interruptPlayback;
  alarmNotificationsToggle.checked = settings.alarmNotifications;

  // Add event listeners to update settings on change
  vibrationToggle.addEventListener("change", () => {
    updateSettings({ vibration: vibrationToggle.checked });
    saveSettings();
    performHapticFeedback();
  });

  hapticsToggle.addEventListener("change", () => {
    updateSettings({ haptics: hapticsToggle.checked });
    saveSettings();
    performHapticFeedback();
  });

  alarmVolumeRange.addEventListener("input", () => {
    updateSettings({ alarmVolume: parseInt(alarmVolumeRange.value, 10) });
    saveSettings();
  });

  interruptPlaybackToggle.addEventListener("change", () => {
    updateSettings({ interruptPlayback: interruptPlaybackToggle.checked });
    saveSettings();
    performHapticFeedback();
  });

  alarmNotificationsToggle.addEventListener("change", () => {
    updateSettings({ alarmNotifications: alarmNotificationsToggle.checked });
    saveSettings();
    performHapticFeedback();
  });
}

/**
 * Performs a haptic feedback if the setting is enabled.
 */
export async function performHapticFeedback() {
  if (settings.haptics) {
    await Haptics.impact({ style: ImpactStyle.Light });
  }
}

/**
 * Performs a vibration if vibration is enabled in the settings.
 */
export async function performVibration() {
  if (settings.vibration) {
    await Haptics.vibrate();
  }
}
