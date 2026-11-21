// Bootstrap: wires the canvases, the HUD and the overlays to SpotGame, and
// runs the render loop. Exposes window.__game for play-testing.
import { SpotGame, PANEL_W, PANEL_H } from './game.js';
import { LEVELS } from './scenes.js';

const $ = (id) => document.getElementById(id);

const leftCanvas = $('panel-left');
const rightCanvas = $('panel-right');

const hud = {
  levelName: $('hud-level'),
  levelTag: $('hud-tag'),
  remaining: $('hud-remaining'),
  total: $('hud-total'),
  timer: $('hud-timer'),
  score: $('hud-score'),
  hints: $('hud-hints'),
  misses: $('hud-misses'),
};

const game = new SpotGame(leftCanvas, rightCanvas, hud);
window.__game = game;

const menuOverlay = $('menu-overlay');
const winOverlay = $('win-overlay');
const winTitle = $('win-title');
const winStats = $('win-stats');

function showMenu() {
  menuOverlay.classList.remove('hidden');
  winOverlay.classList.add('hidden');
  game.backToMenu();
}

function showWin() {
  const stars = game.misses === 0 ? 3 : game.misses <= 2 ? 2 : 1;
  winTitle.textContent = game.level.name + ' complete!';
  winStats.textContent =
    'Score ' + game.score + '  ·  Time ' + $('hud-timer').textContent +
    '  ·  Misses ' + game.misses + '  ·  ' + '★'.repeat(stars) + '☆'.repeat(3 - stars);
  winOverlay.classList.remove('hidden');
  menuOverlay.classList.add('hidden');
}

game.onStateChange = (g) => {
  if (g.state === 'won') showWin();
  else if (g.state === 'playing') {
    menuOverlay.classList.add('hidden');
    winOverlay.classList.add('hidden');
  }
};

// Level cards on the menu.
const levelList = $('level-list');
LEVELS.forEach((level, i) => {
  const card = document.createElement('button');
  card.className = 'level-card';
  card.type = 'button';
  card.innerHTML =
    '<span class="level-num">Level ' + (i + 1) + '</span>' +
    '<span class="level-name">' + level.name + '</span>' +
    '<span class="level-tag">' + level.tagline + '</span>' +
    '<span class="level-count">' + level.diffs.length + ' differences · par ' + level.par + 's</span>';
  card.addEventListener('click', () => game.startLevel(i));
  levelList.appendChild(card);
});

// Clicks on either panel, converted to scene coordinates.
function panelClick(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * PANEL_W;
  const y = ((event.clientY - rect.top) / rect.height) * PANEL_H;
  game.clickAt(x, y);
}
leftCanvas.addEventListener('click', panelClick);
rightCanvas.addEventListener('click', panelClick);

// Buttons.
$('btn-hint').addEventListener('click', () => game.hint());
$('btn-menu').addEventListener('click', showMenu);
$('btn-next').addEventListener('click', () => game.nextLevel());
$('btn-replay').addEventListener('click', () => game.startLevel(game.levelIndex));
$('btn-mute').addEventListener('click', (event) => {
  game.sfx.muted = !game.sfx.muted;
  event.currentTarget.textContent = game.sfx.muted ? 'Sound: off' : 'Sound: on';
});

// Keyboard: H hint, R replay, N next level, 1-3 pick a level, Esc menu.
document.addEventListener('keydown', (event) => {
  if (event.key === 'h' || event.key === 'H') game.hint();
  else if (event.key === 'r' || event.key === 'R') game.startLevel(game.levelIndex);
  else if (event.key === 'n' || event.key === 'N') game.nextLevel();
  else if (event.key === 'Escape') showMenu();
  else if (event.key >= '1' && event.key <= '3') game.startLevel(Number(event.key) - 1);
});

// Render loop.
function frame(now) {
  game.render(now);
  requestAnimationFrame(frame);
}
game.renderHud();
requestAnimationFrame(frame);
