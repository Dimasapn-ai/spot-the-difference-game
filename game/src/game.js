// SpotGame: the state machine of Lantern Hollow. One level at a time, two
// panels, click the differences, watch the counter fall to zero.
import { LEVELS } from './scenes.js';
import { SoundFX } from './audio.js';

export const PANEL_W = 620;
export const PANEL_H = 460;

const WRONG_PENALTY_SEC = 5;
const HINTS_PER_LEVEL = 3;

export class SpotGame {
  constructor(leftCanvas, rightCanvas, hud) {
    this.left = leftCanvas;
    this.right = rightCanvas;
    this.hud = hud;
    this.sfx = new SoundFX();
    this.levelIndex = 0;
    this.level = LEVELS[0];
    this.state = 'menu'; // menu | playing | won
    this.found = new Set();
    this.misses = 0;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.hintTarget = null;
    this.hintUntil = 0;
    this.missMarks = [];
    this.startedAt = 0;
    this.elapsed = 0;
    this.score = 0;
    this.best = {};
    this.flash = null; // {x, y, panel, until, ok}
    this.onStateChange = null;
  }

  get remaining() {
    return this.level.diffs.length - this.found.size;
  }

  get totalScore() {
    return this.score;
  }

  startLevel(index) {
    this.levelIndex = index;
    this.level = LEVELS[index];
    this.found = new Set();
    this.misses = 0;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.hintTarget = null;
    this.missMarks = [];
    this.startedAt = performance.now();
    this.elapsed = 0;
    this.score = 0;
    this.state = 'playing';
    this.sfx.click();
    this.emit();
  }

  backToMenu() {
    this.state = 'menu';
    this.emit();
  }

  // A click on either panel, in scene coordinates (0..620, 0..460).
  clickAt(x, y) {
    if (this.state !== 'playing') return;
    this.sfx.ensure();
    for (const d of this.level.diffs) {
      if (this.found.has(d.id)) continue;
      const dx = x - d.x;
      const dy = y - d.y;
      if (dx * dx + dy * dy <= (d.r + 10) * (d.r + 10)) {
        this.found.add(d.id);
        this.score += 100;
        this.sfx.found();
        this.flash = { x: d.x, y: d.y, until: performance.now() + 450, ok: true };
        if (this.found.size === this.level.diffs.length) this.winLevel();
        this.emit();
        return;
      }
    }
    this.misses += 1;
    this.elapsed += WRONG_PENALTY_SEC;
    this.sfx.miss();
    this.missMarks.push({ x, y, until: performance.now() + 700 });
    this.flash = { x, y, until: performance.now() + 450, ok: false };
    this.emit();
  }

  hint() {
    if (this.state !== 'playing' || this.hintsLeft <= 0) return;
    const unfound = this.level.diffs.filter((d) => !this.found.has(d.id));
    if (unfound.length === 0) return;
    this.hintsLeft -= 1;
    this.hintTarget = unfound[Math.floor(Math.random() * unfound.length)];
    this.hintUntil = performance.now() + 2500;
    this.score = Math.max(0, this.score - 25);
    this.sfx.hint();
    this.emit();
  }

  winLevel() {
    this.state = 'won';
    const timeBonus = Math.max(0, this.level.par - Math.floor(this.elapsed)) * 10;
    this.score += timeBonus;
    this.best[this.level.id] = Math.max(this.best[this.level.id] || 0, this.score);
    this.sfx.win();
    this.emit();
  }

  nextLevel() {
    this.startLevel((this.levelIndex + 1) % LEVELS.length);
  }

  tick(now) {
    if (this.state === 'playing') {
      this.elapsed = (now - this.startedAt) / 1000;
    }
    if (this.hintTarget && now > this.hintUntil) this.hintTarget = null;
    this.missMarks = this.missMarks.filter((m) => now < m.until);
    if (this.flash && now > this.flash.until) this.flash = null;
  }

  emit() {
    if (this.onStateChange) this.onStateChange(this);
    this.renderHud();
  }

  renderHud() {
    const h = this.hud;
    if (!h) return;
    h.levelName.textContent = this.level.name;
    h.levelTag.textContent = this.level.tagline;
    h.remaining.textContent = String(this.remaining);
    h.total.textContent = String(this.level.diffs.length);
    h.timer.textContent = formatTime(this.elapsed);
    h.score.textContent = String(this.score);
    h.hints.textContent = String(this.hintsLeft);
    h.misses.textContent = String(this.misses);
  }

  // Draw one panel: the scene, then markers for what has been found.
  drawPanel(ctx, variant, now) {
    ctx.clearRect(0, 0, PANEL_W, PANEL_H);
    this.level.paint(ctx, variant);
    for (const d of this.level.diffs) {
      if (!this.found.has(d.id)) continue;
      drawFoundRing(ctx, d.x, d.y, d.r, now);
    }
    if (this.hintTarget) {
      const pulse = 1 + 0.12 * Math.sin(now / 130);
      const d = this.hintTarget;
      ctx.save();
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.arc(d.x, d.y, (d.r + 12) * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = '#ffd166';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('HINT — ' + d.hint, d.x, Math.max(18, d.y - d.r - 18));
    }
    for (const m of this.missMarks) {
      drawMiss(ctx, m.x, m.y);
    }
    if (this.flash) {
      if (this.flash.ok) {
        ctx.save();
        ctx.strokeStyle = 'rgba(126,224,129,0.9)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.flash.x, this.flash.y, 26, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else {
        drawMiss(ctx, this.flash.x, this.flash.y);
      }
    }
  }

  render(now) {
    this.tick(now);
    const lctx = this.left.getContext('2d');
    const rctx = this.right.getContext('2d');
    this.drawPanel(lctx, 0, now);
    this.drawPanel(rctx, 1, now);
  }
}

function drawFoundRing(ctx, x, y, r, now) {
  const breathe = 1 + 0.03 * Math.sin(now / 400);
  ctx.save();
  ctx.strokeStyle = '#7ee081';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, (r + 8) * breathe, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#7ee081';
  ctx.beginPath();
  ctx.arc(x, y, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawMiss(ctx, x, y) {
  ctx.save();
  ctx.strokeStyle = '#ff5d5d';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 10);
  ctx.lineTo(x + 10, y + 10);
  ctx.moveTo(x + 10, y - 10);
  ctx.lineTo(x - 10, y + 10);
  ctx.stroke();
  ctx.restore();
}

export function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  return m + ':' + String(s % 60).padStart(2, '0');
}
