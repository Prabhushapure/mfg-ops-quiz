# Safety Scramble — Manufacturing Quality Quiz

A gamified Snakes & Ladders board game that tests manufacturing quality knowledge. Built with React, Vite, Tailwind CSS, Framer Motion, and SVG graphics.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173/quality_quiz/](http://localhost:5173/quality_quiz/) in your browser.

## How to Play

1. Select a topic and click **Play** to begin the 10-minute timer
2. Click **Roll Dice** to move your token across the 6×6 board
3. Land on a **snake head** or **ladder bottom** to trigger a quiz question
4. **Snakes**: answer correctly to stay, wrong answer slides you down
5. **Ladders**: answer correctly to climb up, wrong answer keeps you in place
6. Reach cell 36 with 80%+ quiz accuracy to **pass**

## Tech Stack

- **React 19** + **Vite 7** (TypeScript)
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Framer Motion** for animations
- **SVG** for board, snakes, ladders, player token, and dice
- **Web Audio API** for sound effects

## Build

```bash
npm run build
```

Output is written to `dist/`. Deploy the `dist` folder with the app served at `/quality_quiz/` (matching `base` in `vite.config.ts`).

## Project Structure

```
src/
  App.tsx       — main game page
  main.tsx      — entry point
  components/   — GameBoard, Snake, Ladder, PlayerToken, Dice, QuizPopup, etc.
  data/         — MFG quality quiz questions (JSON)
  hooks/        — useGameState, useTimer, useDice, useSearchParams
  lib/          — boardConfig, gameLogic, sounds, assets
  types/        — TypeScript definitions
public/         — logo, splash video, quiz images
```
