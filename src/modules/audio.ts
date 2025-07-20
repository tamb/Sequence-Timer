let audioContext: AudioContext;
let oscillator: OscillatorNode;

function initializeAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }
}

export function playAlarm() {
  initializeAudio();
  if (oscillator) {
    try {
      oscillator.stop();
    } catch (e) {
      // Ignore errors if the oscillator is already stopped
    }
  }

  const gainNode = audioContext.createGain();
  oscillator = audioContext.createOscillator();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // Lower frequency for a softer sound

  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + 0.2);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
  gainNode.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + 0.7);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.0);
  gainNode.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + 1.2);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.5);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 1.5);
}

export function testAlarm() {
  playAlarm();
} 