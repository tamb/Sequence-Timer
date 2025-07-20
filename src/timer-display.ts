import { LitElement, html, css } from "lit";

export class TimerDisplay extends LitElement {
  declare current: string;
  // ...existing code...
  createRenderRoot() {
    return this;
  }
  static styles = css`
    #currentTimer { font-size: 24px; margin-top: 20px; }
  `;

  static properties = {
    current: { type: String },
  };

  constructor() {
    super();
    this.current = "";
  }

  render() {
    return html`
      <div id="currentTimer" class="text-center">${this.current}</div>
    `;
  }
}

customElements.define("timer-display", TimerDisplay);
