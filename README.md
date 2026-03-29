# Safety Scramble — Industrial Safety Quiz

A gamified Snakes & Ladders board game that tests electrical safety knowledge for industrial workers. Built with Next.js, Tailwind CSS, Framer Motion, and SVG graphics.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Play

1. Click **Start Game** to begin the 10-minute timer
2. Click **Roll Dice** to move your token across the 6x6 board
3. Land on a **snake head** or **ladder bottom** to trigger a quiz question
4. **Snakes**: answer correctly to stay, wrong answer slides you down
5. **Ladders**: answer correctly to climb up, wrong answer keeps you in place
6. Reach cell 36 with 80%+ quiz accuracy to **pass**

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations (dice roll, token movement, popups)
- **SVG** for board, snakes, ladders, player token, and dice
- **Web Audio API** for programmatic sound effects

## Build

```bash
npm run build
```

Deploys to Vercel with zero config.

## Project Structure

```
src/
  app/          — Next.js App Router pages and layout
  components/   — GameBoard, Snake, Ladder, PlayerToken, Dice, QuizPopup, etc.
  data/         — 40 electrical safety quiz questions (JSON)
  hooks/        — useGameState, useTimer, useDice
  lib/          — boardConfig, gameLogic, sounds
  types/        — TypeScript type definitions
public/images/quiz/ — Real photos for quiz questions
```
