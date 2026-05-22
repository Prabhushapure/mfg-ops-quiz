import { useState, useCallback, useRef } from "react";
import { GameState, QuizQuestion } from "@/types/game";
import {
  calculateNewPosition,
  POINTS_PER_CORRECT,
  pickRandomQuestion,
} from "@/lib/gameLogic";
import { getSnakeAt, getLadderAt, TOTAL_CELLS } from "@/lib/boardConfig";
import manufacturingQualityInductionQuestionsData from "@/data/manufacturing-quality-induction-questions.json";
import qualityInManufacturingQuestionsData from "@/data/quality-in-manufacturing-questions.json";
import inhouseQualitySystemsQuestionsData from "@/data/inhouse-quality-systems-questions.json";
import methodsEnsuringProductQualityQuestionsData from "@/data/methods-ensuring-product-quality-questions.json";
import qualityTargetsQuestionsData from "@/data/quality-targets-questions.json";
import peopleRolesIndustrialQualityQuestionsData from "@/data/people-roles-industrial-quality-questions.json";
import {
  playTokenMove,
  playCorrectAnswer,
  playWrongAnswer,
  playSnakeSlide,
  playLadderClimb,
  playGameStart,
} from "@/lib/sounds";

export type GameTopic =
  | "manufacturing-quality-induction"
  | "quality-in-manufacturing"
  | "inhouse-quality-systems"
  | "methods-ensuring-product-quality"
  | "quality-targets"
  | "people-roles-industrial-quality";

const questionBank: Record<GameTopic, QuizQuestion[]> = {
  "manufacturing-quality-induction":
    manufacturingQualityInductionQuestionsData as QuizQuestion[],
  "quality-in-manufacturing":
    qualityInManufacturingQuestionsData as QuizQuestion[],
  "inhouse-quality-systems":
    inhouseQualitySystemsQuestionsData as QuizQuestion[],
  "methods-ensuring-product-quality":
    methodsEnsuringProductQualityQuestionsData as QuizQuestion[],
  "quality-targets": qualityTargetsQuestionsData as QuizQuestion[],
  "people-roles-industrial-quality":
    peopleRolesIndustrialQualityQuestionsData as QuizQuestion[],
};

const initialState: GameState = {
  phase: "start",
  playerPosition: 1,
  score: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  totalQuestions: 0,
  currentQuestion: null,
  activeSnakeOrLadder: null,
  isSnakeQuiz: false,
  diceValue: null,
  isRolling: false,
  isMoving: false,
  questionsAsked: new Set<string>(),
  timeRemaining: 600,
  goalReached: false,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(initialState);
  const [selectedTopic, setSelectedTopic] = useState<GameTopic>(
    "quality-in-manufacturing"
  );
  const movingRef = useRef(false);

  const startGame = useCallback((topic: GameTopic) => {
    playGameStart();
    setSelectedTopic(topic);
    setState({
      ...initialState,
      phase: "playing",
      questionsAsked: new Set<string>(),
    });
  }, []);

  const animateMovement = useCallback(
    (from: number, to: number): Promise<void> => {
      return new Promise((resolve) => {
        if (from === to) {
          resolve();
          return;
        }
        movingRef.current = true;
        setState((prev) => ({ ...prev, isMoving: true }));

        const step = to > from ? 1 : -1;
        let current = from;
        const interval = setInterval(() => {
          current += step;
          playTokenMove();
          setState((prev) => ({ ...prev, playerPosition: current }));
          if (current === to) {
            clearInterval(interval);
            movingRef.current = false;
            setState((prev) => ({ ...prev, isMoving: false }));
            resolve();
          }
        }, 200);
      });
    },
    []
  );

  const handleDiceRoll = useCallback(
    async (diceValue: number) => {
      const currentPos = state.playerPosition;
      const newPos = calculateNewPosition(currentPos, diceValue);

      setState((prev) => ({ ...prev, diceValue }));

      // If roll overshoots, turn is skipped
      if (newPos === currentPos) {
        return;
      }

      // Animate movement
      await animateMovement(currentPos, newPos);

      // Check if reached finish
      if (newPos === TOTAL_CELLS) {
        setState((prev) => ({
          ...prev,
          playerPosition: newPos,
          goalReached: true,
          phase: "result",
        }));
        return;
      }

      // Check for snake or ladder
      const snake = getSnakeAt(newPos);
      const ladder = getLadderAt(newPos);
      const selectedQuestions = questionBank[selectedTopic] ?? [];

      if (snake) {
        const question = pickRandomQuestion(selectedQuestions, state.questionsAsked);
        if (question) {
          setState((prev) => ({
            ...prev,
            phase: "quiz",
            currentQuestion: question,
            activeSnakeOrLadder: snake,
            isSnakeQuiz: true,
            questionsAsked: new Set([...prev.questionsAsked, question.id]),
          }));
        }
      } else if (ladder) {
        const question = pickRandomQuestion(selectedQuestions, state.questionsAsked);
        if (question) {
          setState((prev) => ({
            ...prev,
            phase: "quiz",
            currentQuestion: question,
            activeSnakeOrLadder: ladder,
            isSnakeQuiz: false,
            questionsAsked: new Set([...prev.questionsAsked, question.id]),
          }));
        }
      }
    },
    [state.playerPosition, state.questionsAsked, animateMovement, selectedTopic]
  );

  const handleAnswer = useCallback(
    async (answer: "A" | "B" | "C" | "D") => {
      if (!state.currentQuestion || !state.activeSnakeOrLadder) return;

      const isCorrect = answer === state.currentQuestion.correctAnswer;
      const snakeOrLadder = state.activeSnakeOrLadder;
      const isSnake = state.isSnakeQuiz;

      // Update score
      setState((prev) => ({
        ...prev,
        totalQuestions: prev.totalQuestions + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        wrongAnswers: prev.wrongAnswers + (isCorrect ? 0 : 1),
        score: prev.score + (isCorrect ? POINTS_PER_CORRECT : 0),
      }));

      // Return the answer result for the QuizPopup to display
      return { isCorrect, snakeOrLadder, isSnake };
    },
    [state.currentQuestion, state.activeSnakeOrLadder, state.isSnakeQuiz]
  );

  const handleQuizDismiss = useCallback(
    async (isCorrect: boolean) => {
      const snakeOrLadder = state.activeSnakeOrLadder;
      const isSnake = state.isSnakeQuiz;

      setState((prev) => ({
        ...prev,
        phase: "playing",
        currentQuestion: null,
        activeSnakeOrLadder: null,
      }));

      if (isSnake) {
        if (isCorrect) {
          // Stay on current cell
          playCorrectAnswer();
        } else {
          // Slide down to snake tail
          playWrongAnswer();
          await new Promise((r) => setTimeout(r, 300));
          playSnakeSlide();
          await animateMovement(
            state.playerPosition,
            snakeOrLadder!.to
          );
        }
      } else {
        if (isCorrect) {
          // Climb up ladder
          playCorrectAnswer();
          await new Promise((r) => setTimeout(r, 300));
          playLadderClimb();
          await animateMovement(
            state.playerPosition,
            snakeOrLadder!.to
          );
          // Check if climbed to finish
          if (snakeOrLadder!.to === TOTAL_CELLS) {
            setState((prev) => ({
              ...prev,
              goalReached: true,
              phase: "result",
            }));
          }
        } else {
          // Stay on current cell
          playWrongAnswer();
        }
      }
    },
    [state.activeSnakeOrLadder, state.isSnakeQuiz, state.playerPosition, animateMovement]
  );

  const endGame = useCallback((timeRemaining: number) => {
    setState((prev) => ({
      ...prev,
      phase: "result",
      timeRemaining,
    }));
  }, []);

  const updateTimeRemaining = useCallback((time: number) => {
    setState((prev) => ({ ...prev, timeRemaining: time }));
  }, []);

  const resetGame = useCallback(() => {
    setState({
      ...initialState,
      questionsAsked: new Set<string>(),
    });
  }, []);

  return {
    state,
    selectedTopic,
    setSelectedTopic,
    startGame,
    handleDiceRoll,
    handleAnswer,
    handleQuizDismiss,
    endGame,
    updateTimeRemaining,
    resetGame,
  };
}
