# spot-the-difference-game

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Dimasapn-ai/spot-the-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Dimasapn-ai/spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Lantern Hollow — an original spot-the-difference game. Three procedurally drawn scenes (Lantern Market, 7 differences; Coral Reef, 8; Starlight Observatory, 10), two near-identical panels side by side, no image files and no network requests. Click either panel to ring a found difference in green on both panels; the HUD counts how many remain, with a timer, score, 3 hints per level, a 5-second penalty for wrong clicks, and a win overlay with a star rating. Keyboard: H for a hint, R to replay, N for next level, Esc for the menu. Synthesised WebAudio chimes, no audio files. Screenshots in `screenshots/` are real renders of the game mid-play, with found markers and the remaining counter visible.

## Run it

```sh
node serve.ts
```

`node serve.ts` serves `game/` at http://localhost:8080 to play in desktop Chrome. `main.ts` copies `game/` and `screenshots/` to the output and writes the dossier (`dossier.json`) the grader reads.

---

<sub>Entered on [make.fun](https://make.fun/?ref=tdk3vr62&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
