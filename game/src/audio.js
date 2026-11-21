// Synthesised sound effects: no audio files, everything is WebAudio.
export class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  tone(freq, at, dur, type, vol) {
    const ctx = this.ensure();
    if (!ctx || this.muted) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + at);
    gain.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + at);
    osc.stop(ctx.currentTime + at + dur + 0.05);
  }

  // A happy two-note chime when a difference is found.
  found() {
    this.tone(880, 0, 0.16, 'sine', 0.22);
    this.tone(1318.5, 0.09, 0.28, 'sine', 0.2);
  }

  // A dull thud for a wrong click.
  miss() {
    this.tone(140, 0, 0.18, 'triangle', 0.2);
    this.tone(98, 0.05, 0.2, 'triangle', 0.16);
  }

  // A soft blip when a hint is spent.
  hint() {
    this.tone(1046.5, 0, 0.12, 'sine', 0.14);
  }

  // A little arpeggio for clearing a level.
  win() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, i * 0.11, 0.3, 'sine', 0.2));
  }

  click() {
    this.tone(660, 0, 0.06, 'sine', 0.1);
  }
}
