// Small canvas shape helpers shared by every scene painter.
export function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// A four-point sparkle, used for stars and glints.
export function sparkle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

// A five-pointed star.
export function fiveStar(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 === 0 ? r : r * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

// A glowing paper lantern with a tassel.
export function lantern(ctx, x, y, s, color, glow) {
  if (glow) {
    const g = ctx.createRadialGradient(x, y, s * 0.2, x, y, s * 1.9);
    g.addColorStop(0, glow);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    circle(ctx, x, y, s * 1.9);
    ctx.fill();
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, s, s * 1.15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 1.5;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.ellipse(x, y, s * 0.82, s * 1.15, 0, -0.9 + i * 0.45, 0.9 + i * 0.45);
    ctx.stroke();
  }
  ctx.fillStyle = '#f7c948';
  ctx.fillRect(x - s * 0.32, y - s * 1.32, s * 0.64, s * 0.22);
  ctx.fillRect(x - s * 0.32, y + s * 1.1, s * 0.64, s * 0.22);
  ctx.strokeStyle = '#e8b23a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y + s * 1.3);
  ctx.lineTo(x, y + s * 1.75);
  ctx.stroke();
}

// A simple pine tree.
export function pine(ctx, x, y, h, color) {
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(x - 3, y - h * 0.18, 6, h * 0.18);
  ctx.fillStyle = color;
  for (let i = 0; i < 3; i++) {
    const w = h * (0.52 - i * 0.13);
    const top = y - h + i * h * 0.26;
    ctx.beginPath();
    ctx.moveTo(x - w / 2, top + h * 0.3);
    ctx.lineTo(x, top);
    ctx.lineTo(x + w / 2, top + h * 0.3);
    ctx.closePath();
    ctx.fill();
  }
}

// A small fish, facing right unless flip is set.
export function fish(ctx, x, y, s, color, flip) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, s, s * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-s * 0.8, 0);
  ctx.lineTo(-s * 1.5, -s * 0.6);
  ctx.lineTo(-s * 1.5, s * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#10202e';
  circle(ctx, s * 0.45, -s * 0.12, s * 0.11);
  ctx.fill();
  ctx.restore();
}

// A rising bubble.
export function bubble(ctx, x, y, r) {
  ctx.strokeStyle = 'rgba(220,245,255,0.85)';
  ctx.lineWidth = 1.5;
  circle(ctx, x, y, r);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  circle(ctx, x - r * 0.35, y - r * 0.35, r * 0.22);
  ctx.fill();
}

// A striped market awning.
export function awning(ctx, x, y, w, h, c1, c2) {
  const stripes = 6;
  const sw = w / stripes;
  for (let i = 0; i < stripes; i++) {
    ctx.fillStyle = i % 2 === 0 ? c1 : c2;
    ctx.fillRect(x + i * sw, y, sw + 1, h);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  for (let i = 0; i < stripes; i++) {
    ctx.beginPath();
    ctx.moveTo(x + i * sw, y + h);
    ctx.lineTo(x + (i + 1) * sw, y + h);
    ctx.lineTo(x + (i + 0.5) * sw, y + h + 9);
    ctx.closePath();
    ctx.fill();
  }
}
