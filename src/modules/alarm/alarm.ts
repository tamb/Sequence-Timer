/**
 * @file Manages the alarm, including sound and vibration.
 */

import { settings } from "../state/state";
import { performVibration } from "../settings/settings";
import type { Audio } from "../audio/audio";

export class Alarm {
  private audio: Audio;
  private playing = false;

  constructor(audio: Audio) {
    this.audio = audio;
  }

  /**
   * Plays the alarm sound and triggers vibration if enabled.
   */
  async play(): Promise<void> {
    performVibration();
    await this.audio.playTone(settings.alarmVolume);
    this.playing = true;
  }

  /**
   * Stops the alarm sound.
   */
  async stop(): Promise<void> {
    await this.audio.stop();
    this.playing = false;
  }

  /**
   * Checks if the alarm is currently playing.
   * @returns {boolean} - True if the alarm is playing, false otherwise.
   */
  isPlaying(): boolean {
    return this.playing;
  }

  /**
   * Plays a test alarm.
   */
  test(): void {
    this.play();
  }
}
