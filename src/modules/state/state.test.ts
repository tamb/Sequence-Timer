/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "vitest";
import { timers, settings, updateSettings } from "./state";
import type { TTimer, TSettings } from "./state";

describe("state", () => {
  beforeEach(() => {
    // Reset state before each test
    timers.length = 0;
    updateSettings({
      vibration: true,
      haptics: true,
      alarmVolume: 10,
      interruptPlayback: true,
      alarmNotifications: true,
    });
  });

  it("should have an empty timers array by default", () => {
    expect(timers).toEqual([]);
  });

  it("should have default settings", () => {
    expect(settings).toEqual({
      vibration: true,
      haptics: true,
      alarmVolume: 10,
      interruptPlayback: true,
      alarmNotifications: true,
    });
  });

  it("should update settings", () => {
    const newSettings: Partial<TSettings> = {
      vibration: false,
      alarmVolume: 5,
      interruptPlayback: false,
      alarmNotifications: false,
    };
    updateSettings(newSettings);
    expect(settings).toEqual({
      vibration: false,
      haptics: true,
      alarmVolume: 5,
      interruptPlayback: false,
      alarmNotifications: false,
    });
  });

  it("should allow adding timers", () => {
    const newTimer: TTimer = {
      id: "1",
      label: "Test",
      hours: 0,
      minutes: 1,
      seconds: 0,
      ms: 0,
    };
    timers.push(newTimer);
    expect(timers).toHaveLength(1);
    expect(timers[0]).toEqual(newTimer);
  });
});
