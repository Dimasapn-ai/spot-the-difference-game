// Three original scenes, each drawn procedurally on canvas — no image
// files, no network. paint(ctx, variant) draws one panel: variant 0 is the
// left picture, variant 1 the right picture. Every difference lives in the
// level's diffs list; the painter checks `v === 1` to draw the changed side.
import { mulberry32, range, int } from './rng.js';
import { circle, roundRect, sparkle, fiveStar, lantern, pine, fish, bubble, awning } from './draw.js';

// ---------------------------------------------------------------- level 1
function paintMarket(ctx, v) {
  const rng = mulberry32(1101);
  const sky = ctx.createLinearGradient(0, 0, 0, 460);
  sky.addColorStop(0, '#1b1740');
  sky.addColorStop(0.55, '#3b2a63');
  sky.addColorStop(1, '#6b3a5e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 620, 460);

  // Stars, seeded so both panels match.
  for (let i = 0; i < 46; i++) {
    const x = range(rng, 8, 612);
    const y = range(rng, 8, 170);
    const r = range(rng, 0.8, 2.1);
    ctx.fillStyle = 'rgba(255,244,200,0.9)';
    circle(ctx, x, y, r);
    ctx.fill();
  }
  // Difference: bright sparkle star, present on the left only.
  if (v === 0) sparkle(ctx, 120, 58, 9, '#ffe9a8');

  // Moon: full on the left, crescent on the right.
  ctx.fillStyle = '#f6e7b8';
  circle(ctx, 520, 70, 32);
  ctx.fill();
  if (v === 1) {
    ctx.fillStyle = '#2c2352';
    circle(ctx, 534, 62, 28);
    ctx.fill();
  }

  // Distant rooftops.
  ctx.fillStyle = '#241c44';
  ctx.beginPath();
  ctx.moveTo(0, 250);
  ctx.lineTo(70, 205);
  ctx.lineTo(150, 250);
  ctx.lineTo(230, 200);
  ctx.lineTo(320, 252);
  ctx.lineTo(410, 208);
  ctx.lineTo(500, 250);
  ctx.lineTo(580, 204);
  ctx.lineTo(620, 246);
  ctx.lineTo(620, 460);
  ctx.lineTo(0, 460);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,214,120,0.85)';
  for (const [wx, wy] of [[95, 228], [260, 224], [430, 226], [545, 224]]) {
    ctx.fillRect(wx, wy, 10, 12);
  }

  // String of bulbs across the top.
  ctx.strokeStyle = '#120e26';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 96);
  ctx.quadraticCurveTo(310, 140, 620, 92);
  ctx.stroke();
  for (let i = 0; i < 13; i++) {
    const t = i / 12;
    const x = t * 620;
    const y = 96 + Math.sin(t * Math.PI) * 22 + t * -4;
    ctx.fillStyle = ['#ff5d5d', '#ffd166', '#7ee081', '#6cb4ff'][i % 4];
    circle(ctx, x, y + 8, 5);
    ctx.fill();
  }

  // Hanging paper lanterns.
  const lanternColors = v === 1
    ? ['#ff5d5d', '#ff5d5d', '#2fae7d', '#ff5d5d', '#ff5d5d']
    : ['#ff5d5d', '#ff5d5d', '#ff5d5d', '#ff5d5d', '#ff5d5d'];
  for (let i = 0; i < 5; i++) {
    const x = 90 + i * 110;
    lantern(ctx, x, 168, 20, lanternColors[i], 'rgba(255,120,90,0.20)');
  }

  // Bunting flags.
  ctx.strokeStyle = '#120e26';
  ctx.beginPath();
  ctx.moveTo(20, 118);
  ctx.quadraticCurveTo(310, 152, 600, 116);
  ctx.stroke();
  const flagColors = ['#ff5d5d', '#ffd166', '#7ee081', '#6cb4ff', '#c77dff'];
  for (let i = 0; i < 11; i++) {
    // Difference: one flag missing on the right (the 4th).
    if (v === 1 && i === 3) continue;
    const t = i / 10;
    const x = 30 + t * 560;
    const y = 122 + Math.sin(t * Math.PI) * 14;
    ctx.fillStyle = flagColors[i % 5];
    ctx.beginPath();
    ctx.moveTo(x - 11, y);
    ctx.lineTo(x + 11, y);
    ctx.lineTo(x, y + 20);
    ctx.closePath();
    ctx.fill();
  }

  // Cobblestone ground.
  ctx.fillStyle = '#4a3560';
  ctx.fillRect(0, 330, 620, 130);
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  for (let i = 0; i < 40; i++) {
    const x = range(rng, 0, 600);
    const y = range(rng, 336, 452);
    roundRect(ctx, x, y, 26, 12, 5);
    ctx.fill();
  }

  // Three market stalls.
  const stalls = [
    { x: 36, w: 168, c1: '#d94f3d', c2: '#f6e3c5', goods: 'tea' },
    { x: 232, w: 156, c1: v === 1 ? '#2fae7d' : '#d94f3d', c2: '#f6e3c5', goods: 'fruit' },
    { x: 416, w: 168, c1: '#3d6fd9', c2: '#f6e3c5', goods: 'toys' },
  ];
  for (const s of stalls) {
    awning(ctx, s.x, 236, s.w, 26, s.c1, s.c2);
    ctx.fillStyle = '#2c1f3e';
    ctx.fillRect(s.x + 4, 262, s.w - 8, 4);
    ctx.fillStyle = '#6b4a2f';
    ctx.fillRect(s.x + 8, 266, s.w - 16, 66);
    ctx.fillStyle = '#8a6238';
    ctx.fillRect(s.x + 8, 266, s.w - 16, 8);
    if (s.goods === 'tea') {
      // Difference: teapot on the left, a stack of cups on the right.
      if (v === 0) {
        ctx.fillStyle = '#c77dff';
        circle(ctx, s.x + 60, 296, 16);
        ctx.fill();
        ctx.fillStyle = '#c77dff';
        ctx.fillRect(s.x + 52, 276, 16, 8);
        ctx.strokeStyle = '#c77dff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(s.x + 78, 296, 9, -1.2, 1.2);
        ctx.stroke();
      } else {
        ctx.fillStyle = '#ffd166';
        for (let i = 0; i < 3; i++) ctx.fillRect(s.x + 46 + i * 4, 288 - i * 9, 26, 8);
      }
      ctx.fillStyle = '#ffd166';
      ctx.fillRect(s.x + 110, 292, 22, 12);
      ctx.fillStyle = '#7ee081';
      circle(ctx, s.x + 132, 296, 7);
      ctx.fill();
    } else if (s.goods === 'fruit') {
      ctx.fillStyle = '#ff8c42';
      for (let i = 0; i < 4; i++) {
        circle(ctx, s.x + 30 + i * 26, 296, 10);
        ctx.fill();
      }
      ctx.fillStyle = '#7ee081';
      circle(ctx, s.x + 116, 292, 11);
      ctx.fill();
    } else {
      ctx.fillStyle = '#ffd166';
      fiveStar(ctx, s.x + 40, 296, 12, '#ffd166');
      circle(ctx, s.x + 84, 298, 11);
      ctx.fillStyle = '#ff5d5d';
      ctx.fill();
      ctx.fillStyle = '#6cb4ff';
      roundRect(ctx, s.x + 116, 284, 24, 24, 5);
      ctx.fill();
    }
  }

  // Crate with a cat — the cat only sits there on the left.
  ctx.fillStyle = '#7a5a34';
  ctx.fillRect(486, 372, 64, 46);
  ctx.strokeStyle = '#5d4225';
  ctx.lineWidth = 2;
  ctx.strokeRect(486, 372, 64, 46);
  ctx.beginPath();
  ctx.moveTo(486, 395);
  ctx.lineTo(550, 395);
  ctx.stroke();
  if (v === 0) {
    ctx.fillStyle = '#2b2b33';
    ctx.beginPath();
    ctx.ellipse(518, 360, 20, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    circle(ctx, 512, 340, 12);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(503, 332);
    ctx.lineTo(506, 318);
    ctx.lineTo(512, 330);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(516, 330);
    ctx.lineTo(522, 318);
    ctx.lineTo(524, 332);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffd166';
    circle(ctx, 508, 339, 2);
    ctx.fill();
    circle(ctx, 516, 339, 2);
    ctx.fill();
    ctx.strokeStyle = '#2b2b33';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(536, 366);
    ctx.quadraticCurveTo(552, 352, 548, 334);
    ctx.stroke();
  }

  // Puddle with a moon reflection.
  ctx.fillStyle = 'rgba(150,180,255,0.25)';
  ctx.beginPath();
  ctx.ellipse(120, 428, 70, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(246,231,184,0.5)';
  ctx.beginPath();
  ctx.ellipse(120, 428, 22, 5, 0, 0, Math.PI * 2);
  ctx.fill();
}

// ---------------------------------------------------------------- level 2
function paintReef(ctx, v) {
  const rng = mulberry32(2202);
  const water = ctx.createLinearGradient(0, 0, 0, 460);
  water.addColorStop(0, '#2ec4b6');
  water.addColorStop(0.5, '#1d7f9e');
  water.addColorStop(1, '#0b3d66');
  ctx.fillStyle = water;
  ctx.fillRect(0, 0, 620, 460);

  // Light rays from the surface.
  ctx.fillStyle = 'rgba(255,255,220,0.10)';
  for (const [x, w] of [[60, 46], [240, 60], [430, 40]]) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + w, 0);
    ctx.lineTo(x + w + 90, 460);
    ctx.lineTo(x + 90, 460);
    ctx.closePath();
    ctx.fill();
  }

  // Sandy floor.
  ctx.fillStyle = '#e8cf9a';
  ctx.beginPath();
  ctx.moveTo(0, 400);
  ctx.quadraticCurveTo(160, 372, 320, 398);
  ctx.quadraticCurveTo(480, 420, 620, 392);
  ctx.lineTo(620, 460);
  ctx.lineTo(0, 460);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(180,140,80,0.5)';
  for (let i = 0; i < 26; i++) {
    circle(ctx, range(rng, 10, 610), range(rng, 408, 452), range(rng, 1.5, 3.5));
    ctx.fill();
  }

  // Rocks.
  ctx.fillStyle = '#6b7c8c';
  ctx.beginPath();
  ctx.ellipse(90, 402, 66, 26, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#5a6b7c';
  ctx.beginPath();
  ctx.ellipse(540, 406, 80, 30, 0, Math.PI, 0);
  ctx.fill();

  // Corals.
  const coralColor = v === 1 ? '#ffd166' : '#ff6b9d';
  ctx.strokeStyle = coralColor;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  for (const [bx, by, len, ang] of [[140, 400, 66, -1.2], [152, 400, 52, -0.7], [128, 400, 44, -1.7]]) {
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.quadraticCurveTo(bx + Math.cos(ang) * len * 0.5, by + Math.sin(ang) * len * 0.6, bx + Math.cos(ang) * len, by + Math.sin(ang) * len);
    ctx.stroke();
  }
  ctx.strokeStyle = '#ff8c42';
  for (const [bx, by, len, ang] of [[470, 400, 60, -1.4], [482, 400, 46, -0.9]]) {
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.quadraticCurveTo(bx + Math.cos(ang) * len * 0.5, by + Math.sin(ang) * len * 0.6, bx + Math.cos(ang) * len, by + Math.sin(ang) * len);
    ctx.stroke();
  }

  // Seaweed: tall on the left, short on the right.
  ctx.strokeStyle = '#2fae7d';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  const weedH = v === 1 ? 46 : 96;
  for (const bx of [552, 566, 580]) {
    ctx.beginPath();
    ctx.moveTo(bx, 404);
    ctx.quadraticCurveTo(bx + 12, 404 - weedH * 0.5, bx - 6, 404 - weedH);
    ctx.stroke();
  }

  // Treasure chest: open with gold on the left, shut on the right.
  ctx.fillStyle = '#7a4a21';
  roundRect(ctx, 62, 372, 62, 30, 4);
  ctx.fill();
  ctx.fillStyle = '#f7c948';
  ctx.fillRect(88, 380, 10, 14);
  if (v === 0) {
    ctx.fillStyle = '#8a5a2b';
    ctx.beginPath();
    ctx.moveTo(62, 372);
    ctx.lineTo(124, 372);
    ctx.lineTo(124, 350);
    ctx.quadraticCurveTo(93, 334, 62, 350);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffd166';
    for (let i = 0; i < 6; i++) {
      circle(ctx, 74 + i * 9, 366 - (i % 2) * 5, 5);
      ctx.fill();
    }
  } else {
    ctx.fillStyle = '#8a5a2b';
    roundRect(ctx, 62, 360, 62, 14, 7);
    ctx.fill();
  }

  // Starfish on the sand — left only.
  if (v === 0) fiveStar(ctx, 540, 424, 16, '#ff9f5a');

  // Crab — left only.
  if (v === 0) {
    ctx.fillStyle = '#ff6b5e';
    ctx.beginPath();
    ctx.ellipse(300, 420, 20, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff6b5e';
    circle(ctx, 286, 404, 6);
    ctx.fill();
    circle(ctx, 314, 404, 6);
    ctx.fill();
    ctx.fillStyle = '#10202e';
    circle(ctx, 288, 402, 2);
    ctx.fill();
    circle(ctx, 316, 402, 2);
    ctx.fill();
    ctx.strokeStyle = '#ff6b5e';
    ctx.lineWidth = 3;
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(300 + s * 18, 424);
      ctx.lineTo(300 + s * 30, 430);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(300 + s * 18, 416);
      ctx.lineTo(300 + s * 30, 410);
      ctx.stroke();
    }
  }

  // Fish school; one fish changes colour between panels.
  const school = [
    { x: 200, y: 180, s: 20, flip: false, diff: true },
    { x: 260, y: 210, s: 16, flip: false, diff: false },
    { x: 310, y: 160, s: 14, flip: true, diff: false },
    { x: 350, y: 230, s: 18, flip: false, diff: false },
    { x: 150, y: 240, s: 13, flip: true, diff: false },
  ];
  for (const f of school) {
    const color = f.diff ? (v === 1 ? '#b388ff' : '#ff8c42') : '#ffd166';
    fish(ctx, f.x, f.y, f.s, color, f.flip);
  }

  // Turtle — left only.
  if (v === 0) {
    ctx.fillStyle = '#3f9e6b';
    ctx.beginPath();
    ctx.ellipse(470, 120, 42, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2f7d53';
    ctx.beginPath();
    ctx.ellipse(470, 112, 30, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3f9e6b';
    circle(ctx, 516, 116, 12);
    ctx.fill();
    ctx.fillStyle = '#10202e';
    circle(ctx, 520, 112, 2.5);
    ctx.fill();
    ctx.strokeStyle = '#3f9e6b';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    for (const [fx, fy, tx, ty] of [[440, 140, 428, 152], [500, 140, 512, 152], [440, 100, 428, 90], [500, 100, 512, 90]]) {
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(tx, ty);
      ctx.stroke();
    }
  }

  // Bubble cluster — left only.
  if (v === 0) {
    bubble(ctx, 330, 90, 10);
    bubble(ctx, 348, 66, 7);
    bubble(ctx, 316, 60, 5);
    bubble(ctx, 340, 40, 4);
  }
  // A few shared bubbles.
  bubble(ctx, 90, 300, 6);
  bubble(ctx, 110, 270, 4);
  bubble(ctx, 560, 180, 7);
}

// ---------------------------------------------------------------- level 3
function paintObservatory(ctx, v) {
  const rng = mulberry32(3303);
  const sky = ctx.createLinearGradient(0, 0, 0, 460);
  sky.addColorStop(0, '#0b1030');
  sky.addColorStop(0.6, '#1c2a55');
  sky.addColorStop(1, '#3a4a7a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 620, 460);

  // Stars + a little dipper; one star of the dipper is missing on the right.
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    circle(ctx, range(rng, 8, 612), range(rng, 8, 210), range(rng, 0.7, 1.9));
    ctx.fill();
  }
  const dipper = [[500, 62], [528, 52], [556, 58], [578, 74], [548, 88], [520, 82], [496, 92]];
  ctx.strokeStyle = 'rgba(180,200,255,0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  dipper.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.stroke();
  dipper.forEach(([x, y], i) => {
    if (v === 1 && i === 3) return; // missing star
    sparkle(ctx, x, y, 6, '#dfe8ff');
  });

  // Meteor — left only.
  if (v === 0) {
    const g = ctx.createLinearGradient(180, 52, 260, 80);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(1, 'rgba(255,255,255,0.95)');
    ctx.strokeStyle = g;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(180, 52);
    ctx.lineTo(262, 82);
    ctx.stroke();
    sparkle(ctx, 264, 83, 7, '#ffffff');
  }

  // Moon.
  ctx.fillStyle = '#e8ecf7';
  circle(ctx, 90, 66, 26);
  ctx.fill();
  ctx.fillStyle = '#c9d2e8';
  circle(ctx, 80, 60, 6);
  ctx.fill();
  circle(ctx, 98, 74, 4);
  ctx.fill();

  // Mountains.
  ctx.fillStyle = '#232c52';
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.lineTo(120, 170);
  ctx.lineTo(240, 300);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#1a2140';
  ctx.beginPath();
  ctx.moveTo(180, 300);
  ctx.lineTo(340, 150);
  ctx.lineTo(520, 300);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#2c3766';
  ctx.beginPath();
  ctx.moveTo(420, 300);
  ctx.lineTo(540, 190);
  ctx.lineTo(620, 300);
  ctx.closePath();
  ctx.fill();
  // Snowcap on the right peak — left only.
  if (v === 0) {
    ctx.fillStyle = '#f4f7ff';
    ctx.beginPath();
    ctx.moveTo(518, 218);
    ctx.lineTo(540, 190);
    ctx.lineTo(562, 218);
    ctx.lineTo(550, 212);
    ctx.lineTo(540, 224);
    ctx.lineTo(530, 212);
    ctx.closePath();
    ctx.fill();
  }

  // Hill with the observatory.
  ctx.fillStyle = '#16213d';
  ctx.beginPath();
  ctx.moveTo(180, 460);
  ctx.quadraticCurveTo(330, 300, 480, 460);
  ctx.closePath();
  ctx.fill();

  // Observatory building + dome.
  ctx.fillStyle = '#c8cdd9';
  ctx.fillRect(280, 252, 100, 58);
  ctx.fillStyle = '#9aa2b5';
  ctx.fillRect(280, 252, 100, 8);
  // Window: lit on the left, dark on the right.
  ctx.fillStyle = v === 0 ? '#ffd166' : '#2c3552';
  ctx.fillRect(296, 272, 18, 22);
  ctx.fillStyle = v === 0 ? '#ffd166' : '#2c3552';
  ctx.fillRect(346, 272, 18, 22);
  ctx.fillStyle = '#e8ecf7';
  ctx.beginPath();
  ctx.arc(330, 252, 52, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#b9c0d1';
  ctx.beginPath();
  ctx.arc(330, 252, 52, Math.PI, 0);
  ctx.lineTo(330, 252);
  ctx.closePath();
  ctx.fill();
  // Dome slit: open with a light beam on the left, shut on the right.
  if (v === 0) {
    ctx.fillStyle = '#0b1030';
    ctx.beginPath();
    ctx.moveTo(330, 200);
    ctx.lineTo(352, 200);
    ctx.lineTo(352, 252);
    ctx.lineTo(330, 252);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255,230,150,0.18)';
    ctx.beginPath();
    ctx.moveTo(341, 200);
    ctx.lineTo(360, 120);
    ctx.lineTo(392, 120);
    ctx.lineTo(352, 200);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.strokeStyle = '#8b93a8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(330, 252, 52, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  // Flag on the dome — left only.
  if (v === 0) {
    ctx.strokeStyle = '#e8ecf7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(330, 200);
    ctx.lineTo(330, 168);
    ctx.stroke();
    ctx.fillStyle = '#ff5d5d';
    ctx.beginPath();
    ctx.moveTo(330, 168);
    ctx.lineTo(356, 176);
    ctx.lineTo(330, 184);
    ctx.closePath();
    ctx.fill();
  }

  // Telescope on a tripod — pointing up on the left, down on the right.
  ctx.strokeStyle = '#3a4258';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(440, 300);
  ctx.lineTo(428, 336);
  ctx.moveTo(440, 300);
  ctx.lineTo(452, 336);
  ctx.moveTo(440, 300);
  ctx.lineTo(440, 336);
  ctx.stroke();
  ctx.save();
  ctx.translate(440, 296);
  ctx.rotate(v === 1 ? 0.7 : -0.6);
  ctx.fillStyle = '#7d8aa8';
  roundRect(ctx, -8, -34, 16, 68, 6);
  ctx.fill();
  ctx.fillStyle = '#aab4cc';
  ctx.fillRect(-10, -40, 20, 10);
  ctx.restore();

  // Pine forest along the bottom, with one extra pine on the left.
  const pines = [[30, 400, 70], [120, 420, 84], [520, 410, 76], [580, 430, 90], [200, 440, 64]];
  for (const [x, y, h] of pines) pine(ctx, x, y, h, '#1d3a2a');
  if (v === 0) pine(ctx, 84, 392, 58, '#1d3a2a');

  // Owl on a branch — left only.
  if (v === 0) {
    ctx.strokeStyle = '#4a3220';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(96, 210);
    ctx.lineTo(140, 196);
    ctx.stroke();
    ctx.fillStyle = '#8a6a4a';
    ctx.beginPath();
    ctx.ellipse(118, 178, 14, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    circle(ctx, 118, 158, 11);
    ctx.fill();
    ctx.fillStyle = '#ffd166';
    circle(ctx, 113, 156, 3);
    ctx.fill();
    circle(ctx, 123, 156, 3);
    ctx.fill();
    ctx.fillStyle = '#8a6a4a';
    ctx.beginPath();
    ctx.moveTo(108, 148);
    ctx.lineTo(110, 138);
    ctx.lineTo(114, 147);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(122, 147);
    ctx.lineTo(126, 138);
    ctx.lineTo(128, 148);
    ctx.closePath();
    ctx.fill();
  }

  // Campfire — burning on the left, cold logs on the right.
  ctx.fillStyle = '#5d4225';
  for (let i = 0; i < 5; i++) {
    circle(ctx, 140 + i * 9, 428, 5);
    ctx.fill();
  }
  ctx.strokeStyle = '#7a5a34';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(128, 424);
  ctx.lineTo(178, 434);
  ctx.moveTo(178, 424);
  ctx.lineTo(128, 434);
  ctx.stroke();
  if (v === 0) {
    const fg = ctx.createRadialGradient(153, 408, 4, 153, 408, 34);
    fg.addColorStop(0, 'rgba(255,190,80,0.85)');
    fg.addColorStop(1, 'rgba(255,120,40,0)');
    ctx.fillStyle = fg;
    circle(ctx, 153, 408, 34);
    ctx.fill();
    ctx.fillStyle = '#ff8c42';
    ctx.beginPath();
    ctx.moveTo(153, 388);
    ctx.quadraticCurveTo(168, 406, 162, 424);
    ctx.quadraticCurveTo(153, 432, 144, 424);
    ctx.quadraticCurveTo(138, 406, 153, 388);
    ctx.fill();
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.moveTo(153, 400);
    ctx.quadraticCurveTo(162, 412, 158, 424);
    ctx.quadraticCurveTo(153, 429, 148, 424);
    ctx.quadraticCurveTo(144, 412, 153, 400);
    ctx.fill();
  }
}

export const LEVELS = [
  {
    id: 'lantern-market',
    name: 'Lantern Market',
    tagline: 'A night market under paper lanterns — 7 differences to find.',
    par: 90,
    diffs: [
      { id: 'moon', x: 520, y: 70, r: 30, hint: 'Look at the moon.' },
      { id: 'cat', x: 512, y: 356, r: 26, hint: 'Something sits on the crate.' },
      { id: 'lantern', x: 310, y: 168, r: 22, hint: 'Check the hanging lanterns.' },
      { id: 'awning', x: 310, y: 249, r: 26, hint: 'Compare the middle stall.' },
      { id: 'flag', x: 198, y: 133, r: 16, hint: 'Count the little flags.' },
      { id: 'star', x: 120, y: 58, r: 14, hint: 'A star sparkles in the sky.' },
      { id: 'teapot', x: 96, y: 292, r: 24, hint: 'What is on the left stall?' },
    ],
    paint: paintMarket,
  },
  {
    id: 'coral-reef',
    name: 'Coral Reef',
    tagline: 'Down among the corals — 8 differences hiding in the blue.',
    par: 120,
    diffs: [
      { id: 'turtle', x: 470, y: 120, r: 30, hint: 'A slow swimmer crosses the reef.' },
      { id: 'fish', x: 200, y: 180, r: 20, hint: 'One fish wears a different colour.' },
      { id: 'chest', x: 93, y: 372, r: 30, hint: 'Is the treasure chest open?' },
      { id: 'bubbles', x: 332, y: 66, r: 18, hint: 'Something is blowing bubbles.' },
      { id: 'starfish', x: 540, y: 424, r: 20, hint: 'Check the sand on the right.' },
      { id: 'seaweed', x: 566, y: 332, r: 26, hint: 'How tall is the seaweed?' },
      { id: 'crab', x: 300, y: 414, r: 22, hint: 'A little crab scuttles on the sand.' },
      { id: 'coral', x: 146, y: 358, r: 26, hint: 'Compare the coral branches.' },
    ],
    paint: paintReef,
  },
  {
    id: 'starlight-observatory',
    name: 'Starlight Observatory',
    tagline: 'A cold clear night on the mountain — 10 differences, look sharp.',
    par: 180,
    diffs: [
      { id: 'owl', x: 118, y: 168, r: 24, hint: 'Something watches from a branch.' },
      { id: 'dome', x: 341, y: 226, r: 28, hint: 'Is the dome open or shut?' },
      { id: 'scope', x: 440, y: 290, r: 22, hint: 'Where does the telescope point?' },
      { id: 'constellation', x: 578, y: 74, r: 16, hint: 'Count the stars of the dipper.' },
      { id: 'pine', x: 84, y: 366, r: 26, hint: 'Count the pine trees.' },
      { id: 'window', x: 305, y: 283, r: 18, hint: 'Are the windows lit?' },
      { id: 'meteor', x: 222, y: 67, r: 18, hint: 'Something streaks across the sky.' },
      { id: 'snow', x: 540, y: 206, r: 24, hint: 'Check the mountain tops.' },
      { id: 'flag', x: 342, y: 176, r: 16, hint: 'A flag flies above the dome.' },
      { id: 'fire', x: 153, y: 412, r: 24, hint: 'Is the campfire burning?' },
    ],
    paint: paintObservatory,
  },
];
