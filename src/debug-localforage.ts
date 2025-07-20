import { LitElement, html, css } from "lit";
import * as localforage from "localforage";

export class DebugLocalforage extends LitElement {
  declare dbInfo: any;

  static properties = {
    dbInfo: { type: Object },
  };

  constructor() {
    super();
    this.dbInfo = {};
    this._loadDbInfo();
  }

  async _loadDbInfo() {
    const keys = await localforage.keys();
    const data: Record<string, any> = {};
    for (const key of keys) {
      data[key] = await localforage.getItem(key);
    }
    this.dbInfo = data;
  }

  render() {
    return html`
      <div class="debug-localforage">
        <h3>IndexedDB Debug Info</h3>
        <pre>${JSON.stringify(this.dbInfo, null, 2)}</pre>
        <button class="btn btn-secondary" @click="${() => this._loadDbInfo()}">Refresh</button>
      </div>
    `;
  }
}

customElements.define("debug-localforage", DebugLocalforage);
