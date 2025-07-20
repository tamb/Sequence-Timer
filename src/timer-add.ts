import { LitElement, html, css } from "lit";

export class TimerAdd extends LitElement {
  createRenderRoot() {
    return this;
  }
  static styles = css`
    .input-group { margin-bottom: 1rem; }
  `;

  static properties = {
    editTimer: { type: Object },
  };

  declare editTimer: any | null;

  firstUpdated() {
    this._populateFields();
  }

  updated(changedProps: Map<string, any>) {
    if (changedProps.has("editTimer")) {
      this._populateFields();
    }
  }

  render() {
    const isEdit = !!this.editTimer;
    return html`
      <h2>${isEdit ? "Edit Timer" : "Add Timer"}</h2>
      <div class="input-group mb-3">
        <input type="text" id="timerLabel" class="form-control" placeholder="Label" value="${isEdit ? this.editTimer.label : ""}">
        <input type="number" id="timerHours" class="form-control" placeholder="HH" min="0" value="${isEdit ? this.editTimer.hours : ""}">
        <input type="number" id="timerMinutes" class="form-control" placeholder="MM" min="0" max="59" value="${isEdit ? this.editTimer.minutes : ""}">
        <input type="number" id="timerSeconds" class="form-control" placeholder="SS" min="0" max="59" value="${isEdit ? this.editTimer.seconds : ""}">
        <input type="number" id="timerMs" class="form-control" placeholder="MS" min="0" max="999" value="${isEdit ? this.editTimer.ms : ""}">
        <button class="btn btn-primary" @click="${isEdit ? this._updateTimer : this._addTimer}">${isEdit ? "Update" : "Add Timer"}</button>
        ${isEdit ? html`<button class="btn btn-secondary" @click="${this._cancelEdit}">Cancel</button>` : ""}
      </div>
    `;
  }

  _populateFields() {
    if (!this.editTimer) return;
    (this.renderRoot.querySelector("#timerLabel") as HTMLInputElement).value =
      this.editTimer.label || "";
    (this.renderRoot.querySelector("#timerHours") as HTMLInputElement).value =
      this.editTimer.hours ?? "";
    (this.renderRoot.querySelector("#timerMinutes") as HTMLInputElement).value =
      this.editTimer.minutes ?? "";
    (this.renderRoot.querySelector("#timerSeconds") as HTMLInputElement).value =
      this.editTimer.seconds ?? "";
    (this.renderRoot.querySelector("#timerMs") as HTMLInputElement).value = this.editTimer.ms ?? "";
  }

  _addTimer(event: Event) {
    event.preventDefault();
    const label = (this.renderRoot.querySelector("#timerLabel") as HTMLInputElement).value;
    const hours =
      parseInt((this.renderRoot.querySelector("#timerHours") as HTMLInputElement).value) || 0;
    const minutes =
      parseInt((this.renderRoot.querySelector("#timerMinutes") as HTMLInputElement).value) || 0;
    const seconds =
      parseInt((this.renderRoot.querySelector("#timerSeconds") as HTMLInputElement).value) || 0;
    const ms = parseInt((this.renderRoot.querySelector("#timerMs") as HTMLInputElement).value) || 0;
    // Generate a unique id for new timers
    const id = Math.random().toString(36).slice(2);
    this.dispatchEvent(
      new CustomEvent("add-timer", {
        detail: { id, label, hours, minutes, seconds, ms },
        bubbles: true,
        composed: true,
      }),
    );
    (this.renderRoot.querySelector("#timerLabel") as HTMLInputElement).value = "";
    (this.renderRoot.querySelector("#timerHours") as HTMLInputElement).value = "";
    (this.renderRoot.querySelector("#timerMinutes") as HTMLInputElement).value = "";
    (this.renderRoot.querySelector("#timerSeconds") as HTMLInputElement).value = "";
    (this.renderRoot.querySelector("#timerMs") as HTMLInputElement).value = "";
  }

  _updateTimer(event: Event) {
    event.preventDefault();
    if (!this.editTimer) return;
    const label = (this.renderRoot.querySelector("#timerLabel") as HTMLInputElement).value;
    const hours =
      parseInt((this.renderRoot.querySelector("#timerHours") as HTMLInputElement).value) || 0;
    const minutes =
      parseInt((this.renderRoot.querySelector("#timerMinutes") as HTMLInputElement).value) || 0;
    const seconds =
      parseInt((this.renderRoot.querySelector("#timerSeconds") as HTMLInputElement).value) || 0;
    const ms = parseInt((this.renderRoot.querySelector("#timerMs") as HTMLInputElement).value) || 0;
    this.dispatchEvent(
      new CustomEvent("update-timer", {
        detail: { ...this.editTimer, label, hours, minutes, seconds, ms },
        bubbles: true,
        composed: true,
      }),
    );
    // Clear edit mode
    this.dispatchEvent(new CustomEvent("cancel-edit-timer", { bubbles: true, composed: true }));
  }

  _cancelEdit(event: Event) {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent("cancel-edit-timer", { bubbles: true, composed: true }));
  }
}

customElements.define("timer-add", TimerAdd);
