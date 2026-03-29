import { GameResult, GameState } from "@/types/game";
import { TOTAL_CELLS } from "./boardConfig";

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
  const available = questions.filter((q) => !asked.has(q.id));
  if (available.length === 0) {
    // Reset — all questions used, allow repeats
    return questions[Math.floor(Math.random() * questions.length)];
  }
  return available[Math.floor(Math.random() * available.length)];
}

/**
 * Roll a dice (1-6).
 */
export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1;
}
