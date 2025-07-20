import { LitElement, html, css } from "lit";

export class TimerList extends LitElement {
  createRenderRoot() {
    return this;
  }
  declare timers: any[];
  declare activeTimerId: string | null;

  static properties = {
    timers: { type: Array },
    activeTimerId: { type: String },
  };

  constructor() {
    super();
    this.timers = [];
    this.activeTimerId = null;
  }

  render() {
    return html`
      <h2 class="mb-3">Timers</h2>
      <div class="timer-list">
        ${this.timers.map((timer, idx) => html`
          <div
            class="timer-item d-flex align-items-center justify-content-between border rounded shadow-sm p-3 bg-white${this.activeTimerId === timer.id ? ' border-primary' : ''}"
            style="cursor:default"
            data-timer-id="${timer.id}"
            data-index="${idx}"
          >
            <span class="d-flex flex-column align-items-center me-3">
              <button class="btn btn-sm btn-light p-1 mb-1" ?disabled=${idx === 0} @click=${() => this._moveTimer(idx, -1)} title="Move Up">
                <span class="bi bi-chevron-up"></span>
              </button>
              <button class="btn btn-sm btn-light p-1" ?disabled=${idx === this.timers.length - 1} @click=${() => this._moveTimer(idx, 1)} title="Move Down">
                <span class="bi bi-chevron-down"></span>
              </button>
            </span>
            <span class="fs-2 timer-label-text">${timer.label}</span>
              <span class="fs-5 text-muted">${timer.hours}h ${timer.minutes}m ${timer.seconds}s ${timer.ms}ms</span>
            </span>
            <span class="timer-controls d-flex gap-1">
              <button class="btn btn-sm btn-outline-primary" @click="${() => this._editTimer(timer.id)}" title="Edit">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="${() => this._deleteTimer(timer.id)}" title="Delete">
                <i class="bi bi-trash"></i> Delete
              </button>
            </span>
          </div>
        `)}
      </div>
    `;
  }
  static styles = css``;

  _moveTimer(idx: number, direction: number) {
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= this.timers.length) return;
    const timersCopy = [...this.timers];
    const [moved] = timersCopy.splice(idx, 1);
    timersCopy.splice(newIdx, 0, moved);
    this.dispatchEvent(new CustomEvent("timers-reordered", {
      detail: { timers: timersCopy },
      bubbles: true,
      composed: true,
    }));
  }

  _editTimer(id: string) {
    const timer = this.timers.find(t => t.id === id);
    this.dispatchEvent(new CustomEvent("edit-timer", { detail: { id, timer }, bubbles: true, composed: true }));
  }

  _deleteTimer(id: string) {
    const timer = this.timers.find(t => t.id === id);
    this.dispatchEvent(new CustomEvent("delete-timer", { detail: { id, timer }, bubbles: true, composed: true }));
  }
}

customElements.define("timer-list", TimerList);
