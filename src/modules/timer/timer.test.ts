import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as timer from "./timer";
import { timers, state } from "../state/state";
import { Alarm } from "../alarm/alarm";

vi.mock("../ui/ui", () => ({
  updateTimerList: vi.fn(),
}));

vi.mock("../alarm/alarm", () => {
  const Alarm = vi.fn();
  Alarm.prototype.play = vi.fn();
  return { Alarm };
});

vi.mock("../audio/audio", () => ({
  Audio: vi.fn(),
}));

vi.mock("@capacitor/local-notifications", () => ({
  LocalNotifications: {
    schedule: vi.fn(),
  },
}));

describe("timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    state.currentTimerIndex = -1;
    state.isPaused = false;
    state.isTimerRunning = false;
    state.remainingTime = 0;
    timers.length = 0;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should start the timer and play alarm when finished", () => {
    timers.push({ id: "1", label: "test", hours: 0, minutes: 0, seconds: 1, ms: 0 });
    timer.startTimers();
    expect(state.isTimerRunning).toBe(true);
    vi.advanceTimersByTime(1000);
    expect(state.isTimerRunning).toBe(false);
    expect(Alarm.prototype.play).toHaveBeenCalled();
  });

  it("should run multiple timers and stop when all are finished", () => {
    timers.push(
      { id: "1", label: "test1", hours: 0, minutes: 0, seconds: 1, ms: 0 },
      { id: "2", label: "test2", hours: 0, minutes: 0, seconds: 1, ms: 0 },
    );
    timer.startTimers();
    expect(state.currentTimerIndex).toBe(0);
    vi.advanceTimersByTime(1000);
    expect(state.currentTimerIndex).toBe(1);
    vi.advanceTimersByTime(1000);
    expect(state.currentTimerIndex).toBe(-1);
    expect(state.isTimerRunning).toBe(false);
  });

  it("should pause and resume the timer", () => {
    timers.push({ id: "1", label: "test", hours: 0, minutes: 0, seconds: 2, ms: 0 });
    timer.startTimers();
    vi.advanceTimersByTime(1000);
    timer.pauseResumeTimer();
    expect(state.isPaused).toBe(true);
    expect(state.remainingTime).toBeLessThanOrEqual(1000);
    timer.pauseResumeTimer();
    expect(state.isPaused).toBe(false);
    vi.advanceTimersByTime(1000);
    expect(state.isTimerRunning).toBe(false);
  });

  it("should stop the timer", () => {
    timers.push({ id: "1", label: "test", hours: 0, minutes: 0, seconds: 1, ms: 0 });
    timer.startTimers();
    timer.stopTimers();
    expect(state.isTimerRunning).toBe(false);
    expect(state.currentTimerIndex).toBe(-1);
  });
});
