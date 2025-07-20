import { LitElement, html, css } from "lit";

export class TimerControls extends LitElement {
  createRenderRoot() {
    return this;
  }
  static styles = css``;

  render() {
    return html`
      <button class="btn btn-primary" @click="${() => this._start()}">Start</button>
        <button class="btn btn-warning" @click="${() => this._pauseResume()}">Pause</button>
        <button class="btn btn-danger" @click="${() => this._stop()}">Stop</button>
        <button class="btn btn-secondary" @click="${() => this._reset()}">Reset</button>
    `;
  }

  private _start() {
    this.dispatchEvent(new CustomEvent("start-timers", { bubbles: true, composed: true }));
  }
  private _pauseResume() {
    this.dispatchEvent(new CustomEvent("pause-resume-timer", { bubbles: true, composed: true }));
  }
  private _stop() {
    this.dispatchEvent(new CustomEvent("stop-timers", { bubbles: true, composed: true }));
  }
  private _reset() {
    this.dispatchEvent(new CustomEvent("reset-timers", { bubbles: true, composed: true }));
  }
}

customElements.define("timer-controls", TimerControls);
