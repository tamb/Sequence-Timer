/**
 * @file Manages audio playback using native capabilities with a web fallback.
 */
import { Capacitor } from "@capacitor/core";
import { NativeAudio } from "@capgo/native-audio";

const TONE_ASSET_ID = "tone";
const TONE_ASSET_PATH = "assets/tone.mp3";

export class Audio {
  private isInitialized = false;
  private webAudio: HTMLAudioElement | null = null;

  /**
   * Initializes and preloads the audio file.
   * This is necessary to ensure that audio can be played natively.
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      if (Capacitor.isNativePlatform()) {
        await NativeAudio.configure({
          focus: true,
        });

        await NativeAudio.preload({
          assetId: TONE_ASSET_ID,
          assetPath: TONE_ASSET_PATH,
          audioChannelNum: 1,
          isUrl: false, // Use local asset path
        });
      } else {
        // Web fallback
        this.webAudio = new window.Audio(TONE_ASSET_PATH);
        this.webAudio.preload = "auto";
      }

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    }
  }

  /**
   * Plays the preloaded tone.
   * @param volume - The volume of the tone (0-10).
   */
  async playTone(volume: number): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      if (Capacitor.isNativePlatform()) {
        await NativeAudio.setVolume({
          assetId: TONE_ASSET_ID,
          volume: volume / 10,
        });
        await NativeAudio.play({
          assetId: TONE_ASSET_ID,
        });
      } else if (this.webAudio) {
        // Web fallback
        this.webAudio.volume = volume / 10;
        await this.webAudio.play();
      }
    } catch (error) {
      console.error("Failed to play tone:", error);
    }
  }

  /**
   * Stops the currently playing tone.
   */
  async stop(): Promise<void> {
    if (!this.isInitialized) {
      return;
    }

    try {
      if (Capacitor.isNativePlatform()) {
        await NativeAudio.stop({ assetId: TONE_ASSET_ID });
      } else if (this.webAudio) {
        // Web fallback
        this.webAudio.pause();
        this.webAudio.currentTime = 0;
      }
    } catch (error) {
      console.error("Failed to stop tone:", error);
    }
  }

  /**
   * Releases audio resources.
   */
  async destroy(): Promise<void> {
    if (!this.isInitialized) {
      return;
    }

    try {
      if (Capacitor.isNativePlatform()) {
        await NativeAudio.unload({ assetId: TONE_ASSET_ID });
      } else if (this.webAudio) {
        // Web fallback
        this.webAudio.src = "";
        this.webAudio = null;
      }
      this.isInitialized = false;
    } catch (error) {
      console.error("Failed to unload audio:", error);
    }
  }
}
