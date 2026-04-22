import { GameResult, GameState } from "@/types/game";
import { TOTAL_CELLS, SNAKES } from "./boardConfig";

export const GAME_DURATION = 10 * 60; // 10 minutes in seconds
export const POINTS_PER_CORRECT = 10;
export const PASS_PERCENTAGE = 80;

/**
 * Calculate the new position after a dice roll.
 * Returns current position if roll would overshoot cell 36.
 */
export function calculateNewPosition(
  currentPosition: number,
  diceValue: number
): number {
  const newPosition = currentPosition + diceValue;
  if (newPosition > TOTAL_CELLS) {
    return currentPosition; // Stay put
  }
  return newPosition;
}

/**
 * Generate the path of cells the token moves through (for animation).
 */
export function getMovementPath(from: number, to: number): number[] {
  const path: number[] = [];
  if (to > from) {
    for (let i = from + 1; i <= to; i++) {
      path.push(i);
    }
  } else {
    for (let i = from - 1; i >= to; i--) {
      path.push(i);
    }
  }
  return path;
}

/**
 * Calculate the final game result.
 */
export function calculateResult(state: GameState): GameResult {
  const pointsScored = state.correctAnswers * POINTS_PER_CORRECT;
  const scorePercentage =
    state.totalQuestions > 0
      ? Math.round((state.correctAnswers / state.totalQuestions) * 100)
      : 0;
  const goalReached = state.playerPosition === TOTAL_CELLS;
  const timeRemaining = state.timeRemaining;
  const finalScore = timeRemaining > 0 ? pointsScored * timeRemaining : 0;
  const passed = goalReached && scorePercentage >= PASS_PERCENTAGE;

  return {
    totalQuestions: state.totalQuestions,
    correctAnswers: state.correctAnswers,
    wrongAnswers: state.wrongAnswers,
    pointsScored,
    scorePercentage,
    goalReached,
    timeRemaining,
    finalScore,
    passed,
  };
}

/**
 * Pick a random question that hasn't been asked yet.
 */
export function pickRandomQuestion<
  T extends { id: string },
>(questions: T[], asked: Set<string>): T | null {
  if (questions.length === 0) return null;
  const available = questions.filter((q) => !asked.has(q.id));
  if (available.length === 0) {
    // Reset — all questions used, allow repeats
    return questions[Math.floor(Math.random() * questions.length)];
  }
  return available[Math.floor(Math.random() * available.length)];
}

const SNAKE_BIAS = 0.55; // 55% chance to steer toward a snake head
const snakeHeads = new Set(SNAKES.map((s) => s.from));

/**
 * Roll a dice (1-6).
 * Biased: ~55% of the time, if a roll value would land the player
 * on a snake head, that value is chosen instead of a random one.
 */
export function rollDice(currentPosition?: number): number {
  const fair = Math.floor(Math.random() * 6) + 1;

  if (currentPosition === undefined || Math.random() > SNAKE_BIAS) {
    return fair;
  }

  // Find dice values that land on a snake head
  const snakeValues: number[] = [];
  for (let d = 1; d <= 6; d++) {
    const dest = currentPosition + d;
    if (dest <= TOTAL_CELLS && snakeHeads.has(dest)) {
      snakeValues.push(d);
    }
  }

  if (snakeValues.length > 0) {
    return snakeValues[Math.floor(Math.random() * snakeValues.length)];
  }

  return fair;
}
