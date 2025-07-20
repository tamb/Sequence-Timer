import { LitElement, html } from "lit";

export class TestAlarm extends LitElement {
  constructor() {
    super();
  }
  createRenderRoot() {
    return this;
  }

  playAlarmSound() {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.6, audioContext.currentTime + 0.2);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
    gainNode.gain.linearRampToValueAtTime(0.6, audioContext.currentTime + 0.7);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.0);
    gainNode.gain.linearRampToValueAtTime(0.6, audioContext.currentTime + 1.2);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.5);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1.5);
  }

  playStartSound() {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  }

  render() {
    return html`
      <div class="my-3 d-flex gap-2">
        <button class="btn btn-primary" @click="${() => this.playStartSound()}">Test Start Beep</button>
        <button class="btn btn-danger" @click="${() => this.playAlarmSound()}">Test Alarm Sound</button>
      </div>
    `;
  }
}

customElements.define("test-alarm", TestAlarm);
