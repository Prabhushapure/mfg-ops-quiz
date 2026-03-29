export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
  image?: string;
  topic: string;
}

export type GamePhase = "start" | "playing" | "quiz" | "result";

export interface SnakeOrLadder {
  from: number;
  to: number;
}

export interface CellPosition {
  row: number;
  col: number;
  x: number;
  y: number;
}

export interface GameState {
  phase: GamePhase;
  playerPosition: number;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
  currentQuestion: QuizQuestion | null;
  activeSnakeOrLadder: SnakeOrLadder | null;
  /** Whether the current quiz is triggered by a snake (true) or ladder (false) */
  isSnakeQuiz: boolean;
  diceValue: number | null;
  isRolling: boolean;
  isMoving: boolean;
  questionsAsked: Set<string>;
  timeRemaining: number;
  goalReached: boolean;
}

export interface GameResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  pointsScored: number;
  scorePercentage: number;
  goalReached: boolean;
  timeRemaining: number;
  finalScore: number;
  passed: boolean;
}
