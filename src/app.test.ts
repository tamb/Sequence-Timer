import { describe, it, expect, beforeEach, vi } from "vitest";
import { TimerApp } from "./timer-app";
import { TimerAdd } from "./timer-add";
import { TimerSet } from "./timer-set";
import { TimerList } from "./timer-list";
import { TimerControls } from "./timer-controls";
import { TimerDisplay } from "./timer-display";
import { TestAlarm } from "./test-alarm";
import { DebugLocalforage } from "./debug-localforage";
import * as localforage from "localforage";

function setupDom() {
  document.body.innerHTML = "";
}

describe("TimerApp integration", () => {
  beforeEach(setupDom);
  it("renders all main components", () => {
    const el = new TimerApp();
    document.body.appendChild(el);
    expect(document.querySelector("timer-add")).toBeTruthy();
    expect(document.querySelector("timer-set")).toBeTruthy();
    expect(document.querySelector("timer-list")).toBeTruthy();
    expect(document.querySelector("timer-controls")).toBeTruthy();
    expect(document.querySelector("timer-display")).toBeTruthy();
    expect(document.querySelector("test-alarm")).toBeTruthy();
    document.body.removeChild(el);
  });
});

describe("TimerSet default set", () => {
  beforeEach(async () => {
    await localforage.clear();
    setupDom();
  });
  it("initializes with Example Workout if no sets exist", async () => {
    const el = new TimerSet();
    await new Promise(r => setTimeout(r, 100)); // wait for async
    expect(el.sets.includes("Example Workout")).toBe(true);
    expect(el.selectedSet).toBe("Example Workout");
    expect(Array.isArray(el.timers)).toBe(true);
    expect(el.timers.length).toBe(5);
  });
});

describe("TimerAdd", () => {
  beforeEach(setupDom);
  it("dispatches add-timer event with correct detail", async () => {
    const el = new TimerAdd();
    document.body.appendChild(el);
    await el.updateComplete;
    (el.querySelector("#timerLabel") as HTMLInputElement).value = "Test";
    (el.querySelector("#timerHours") as HTMLInputElement).value = "1";
    (el.querySelector("#timerMinutes") as HTMLInputElement).value = "2";
    (el.querySelector("#timerSeconds") as HTMLInputElement).value = "3";
    (el.querySelector("#timerMs") as HTMLInputElement).value = "4";
    const spy = vi.fn();
    el.addEventListener("add-timer", spy);
    (el.querySelector("button") as HTMLButtonElement).click();
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0].detail).toEqual({
      label: "Test",
      hours: 1,
      minutes: 2,
      seconds: 3,
      ms: 4,
    });
    document.body.removeChild(el);
  });
});

describe("TimerControls", () => {
  beforeEach(setupDom);
  it("dispatches start-timers event", () => {
    const el = new TimerControls();
    document.body.appendChild(el);
    const spy = vi.fn();
    el.addEventListener("start-timers", spy);
    (el.querySelector(".btn-primary") as HTMLButtonElement).click();
    expect(spy).toHaveBeenCalled();
    document.body.removeChild(el);
  });
  it("dispatches reset-timers event", () => {
    const el = new TimerControls();
    document.body.appendChild(el);
    const spy = vi.fn();
    el.addEventListener("reset-timers", spy);
    (el.querySelector(".btn-secondary") as HTMLButtonElement).click();
    expect(spy).toHaveBeenCalled();
    document.body.removeChild(el);
  });
});

describe("TimerDisplay", () => {
  it("renders current timer string", () => {
    const el = new TimerDisplay();
    el.current = "Test Timer";
    document.body.appendChild(el);
    expect(el.querySelector("#currentTimer")?.textContent).toBe("Test Timer");
    document.body.removeChild(el);
  });
});

describe("TimerList", () => {
  it("renders timers list", () => {
    const el = new TimerList();
    el.timers = [
      { label: "A", hours: 0, minutes: 1, seconds: 2, ms: 3 },
      { label: "B", hours: 1, minutes: 2, seconds: 3, ms: 4 },
    ];
    document.body.appendChild(el);
    expect(el.querySelectorAll(".list-group-item").length).toBe(2);
    document.body.removeChild(el);
  });
});

describe("TestAlarm", () => {
  it("renders alarm test buttons", () => {
    const el = new TestAlarm();
    document.body.appendChild(el);
    expect(el.querySelector(".btn-primary")).toBeTruthy();
    expect(el.querySelector(".btn-danger")).toBeTruthy();
    document.body.removeChild(el);
  });
});

describe("DebugLocalforage", () => {
  beforeEach(setupDom);
  it("pretty prints db info", async () => {
    const el = new DebugLocalforage();
    await el._loadDbInfo();
    expect(typeof el.dbInfo).toBe("object");
  });
});
