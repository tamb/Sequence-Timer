import { LitElement, html, css } from "lit";
import "./timer-add";
import "./timer-set";
import "./timer-list";
import "./timer-controls";
import "./test-alarm";
import "./timer-display";
import "./debug-localforage";

export class TimerApp extends LitElement {
  declare editTimer: any | null;
  static properties = {
    timers: { type: Array },
    selectedSet: { type: String },
  };

  // Internal state fields (not reactive)
  private _timers: any[] = [];
  private _selectedSet: string = "Example Workout";

  // Public reactive property: timers
  get timers() {
    return this._timers;
  }
  set timers(val: any[]) {
    const oldVal = this._timers;
    this._timers = val;
    this.requestUpdate("timers", oldVal);
  }

  // Public reactive property: selectedSet
  get selectedSet() {
    return this._selectedSet;
  }
  set selectedSet(val: string) {
    const oldVal = this._selectedSet;
    this._selectedSet = val;
    this.requestUpdate("selectedSet", oldVal);
  }

  constructor() {
    super();
    this.editTimer = null;
    this._loadInitialSet();
  }

  async _saveTimers() {
    const localforage = (await import("localforage")).default;
    if (this.selectedSet) {
      await localforage.setItem(this.selectedSet, this.timers);
    }
  }

  _startTimers() {
    if (!this.timers.length) return;
    this._timerIndex = 0;
    this._runCurrentTimer();
  }

  _runCurrentTimer() {
    if (this._timerIndex >= this.timers.length) {
      this._updateDisplay("All timers complete!");
      return;
    }
    const timer = this.timers[this._timerIndex];
    let totalMs = (timer.hours * 3600000) + (timer.minutes * 60000) + (timer.seconds * 1000) + (timer.ms || 0);
    this._updateDisplay(`${timer.label}: ${timer.hours}h ${timer.minutes}m ${timer.seconds}s ${timer.ms}ms`);
    if (this._timerInterval) clearInterval(this._timerInterval);
    this._timerInterval = setInterval(() => {
      totalMs -= 1000;
      if (totalMs <= 0) {
        clearInterval(this._timerInterval);
        this._timerIndex++;
        this._runCurrentTimer();
      } else {
        const h = Math.floor(totalMs / 3600000);
        const m = Math.floor((totalMs % 3600000) / 60000);
        const s = Math.floor((totalMs % 60000) / 1000);
        const ms = totalMs % 1000;
        this._updateDisplay(`${timer.label}: ${h}h ${m}m ${s}s ${ms}ms`);
      }
    }, 1000);
  }

  _updateDisplay(msg: string) {
    const display = this.querySelector("timer-display") as any;
    if (display) display.current = msg;
  }

  async _loadInitialSet() {
    const timers = await (await import("localforage")).default.getItem(this.selectedSet);
    this.timers = Array.isArray(timers) ? timers : [];
  }

  createRenderRoot() {
    return this;
  }

  static styles = css`
    .container { max-width: 900px; margin: auto; }
    h1 { margin: 1rem 0; }
  `;

  firstUpdated() {
    this.addEventListener("add-timer", (e: any) => {
      const timer = e.detail;
      this.timers = [...this.timers, timer];
      this._saveTimers();
    });
    this.addEventListener("load-timer-set", (e: any) => {
      this.selectedSet = e.detail.name;
      this.timers = e.detail.timers || [];
    });
    this.addEventListener("save-timer-set", (e: any) => {
      this.selectedSet = e.detail.name;
      this._saveTimers();
    });
    this.addEventListener("clear-timer-sets", () => {
      this.selectedSet = "";
      this.timers = [];
    });

    this.addEventListener("edit-timer", (e: any) => {
      const { id, timer } = e.detail;
      this.editTimer = { ...timer };
      this.requestUpdate();
    });

    this.addEventListener("delete-timer", (e: any) => {
      const { id } = e.detail;
      this.timers = this.timers.filter((t: any) => t.id !== id);
      if (this.editTimer && this.editTimer.id === id) {
        this.editTimer = null;
      }
      this._saveTimers();
    });

    this.addEventListener("update-timer", (e: any) => {
      const updated = e.detail;
      this.timers = this.timers.map((t: any) => t.id === updated.id ? updated : t);
      this.editTimer = null;
      this._saveTimers();
    });

    this.addEventListener("cancel-edit-timer", () => {
      this.editTimer = null;
      this.requestUpdate();
    });

    this.addEventListener("timers-reordered", (e: any) => {
      const { timers } = e.detail;
      this.timers = timers;
      this._saveTimers();
    });

    this.addEventListener("start-timers", () => {
      this._startTimers();
    });
  }

  _timerIndex: number = 0;
  _timerInterval: any = null;


  render() {
    return html`
      <div class="container">
        <h1>Workout Timer App</h1>
        <div class="row">
          <div class="col-md-6">
            <timer-add .editTimer=${this.editTimer}></timer-add>
          </div>
          <div class="col-md-6">
            <timer-set .timers=${this.timers} .selectedSet=${this.selectedSet}></timer-set>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <timer-list .timers=${this.timers}></timer-list>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12">
            <timer-controls></timer-controls>
          </div>
        </div>
        <test-alarm></test-alarm>
        <timer-display></timer-display>
        <debug-localforage></debug-localforage>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "timer-app": TimerApp;
  }
}

window.customElements.define("timer-app", TimerApp);
