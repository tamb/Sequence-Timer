import { LitElement, html, css } from "lit";
import * as localforage from "localforage";

export class TimerSet extends LitElement {
  declare sets: string[];
  declare selectedSet: string;
  declare timers: any[];

  static properties = {
    sets: { type: Array },
    selectedSet: { type: String },
  };

  constructor() {
    super();
    this.sets = [];
    this.selectedSet = "";
    this.timers = [];
    this._initDefaultSet();
  }

  async _initDefaultSet() {
    const keys = await localforage.keys();
    if (keys.length === 0) {
      const defaultTimers = [
        { label: "Warmup Movement", hours: 0, minutes: 3, seconds: 30, ms: 0 },
        { label: "Warmup Stretch", hours: 0, minutes: 1, seconds: 30, ms: 0 },
        { label: "Weights", hours: 0, minutes: 15, seconds: 0, ms: 0 },
        { label: "Abs", hours: 0, minutes: 5, seconds: 0, ms: 0 },
        { label: "Cooldown stretch", hours: 0, minutes: 5, seconds: 0, ms: 0 },
      ];
      await localforage.setItem("Example Workout", defaultTimers);
      this.selectedSet = "Example Workout";
      this.timers = defaultTimers;
    }
    this._loadSetsFromDB();
  }

  async _loadSetsFromDB() {
    const keys = await localforage.keys();
    this.sets = keys;
    this.requestUpdate();
  }
  createRenderRoot() {
    return this;
  }
  static styles = css``;

  render() {
    return html`
      <h2>Timer Set</h2>
      <div class="input-group mb-3">
        <input type="text" id="timerSetName" class="form-control" placeholder="Timer Set Name" value="${this.selectedSet}">
        <button class="btn btn-success" @click="${() => this._saveSet()}">Save Timer Set</button>
        <button class="btn btn-danger" @click="${() => this._clearSets()}">Clear Saved Sets</button>
      </div>
      <div class="input-group">
        <select id="savedSets" class="form-select" @change="${(e: Event) => this._selectSet(e)}">
          ${this.sets.map((set) => html`<option value="${set}" ?selected="${set === this.selectedSet}">${set}</option>`)}
        </select>
        <button class="btn btn-info" @click="${() => this._loadSet()}">Load Timer Set</button>
      </div>
    `;
  }

  private _saveSet() {
    const name = (this.querySelector("#timerSetName") as HTMLInputElement).value.trim();
    if (!name) return;
    // Replace with actual timers data
    const timers: any[] = this.timers;
    localforage.setItem(name, timers).then(() => {
      this.selectedSet = name;
      this._loadSetsFromDB();
      this.dispatchEvent(
        new CustomEvent("save-timer-set", {
          detail: { name },
          bubbles: true,
          composed: true,
        }),
      );
    });
  }

  private _clearSets() {
    Promise.all(this.sets.map((set) => localforage.removeItem(set))).then(() => {
      this.selectedSet = "";
      this._loadSetsFromDB();
      this.dispatchEvent(
        new CustomEvent("clear-timer-sets", {
          bubbles: true,
          composed: true,
        }),
      );
    });
  }

  private _loadSet() {
    const select = this.querySelector("#savedSets") as HTMLSelectElement;
    const name = select.value;
    localforage.getItem(name).then((timers: any) => {
      this.selectedSet = name;
      this.timers = timers || [];
      this.dispatchEvent(
        new CustomEvent("load-timer-set", {
          detail: { name, timers: this.timers },
          bubbles: true,
          composed: true,
        }),
      );
    });
  }

  _selectSet(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.selectedSet = select.value;
  }
}
// ...existing code...

customElements.define("timer-set", TimerSet);
