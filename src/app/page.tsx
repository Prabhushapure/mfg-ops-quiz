"use client";

import { useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import GameBoard from "@/components/GameBoard";
import Dice from "@/components/Dice";
import GameHeader from "@/components/GameHeader";
import StartScreen from "@/components/StartScreen";
import QuizPopup from "@/components/QuizPopup";
import ResultScreen from "@/components/ResultScreen";
import { useGameState } from "@/hooks/useGameState";
import { useTimer } from "@/hooks/useTimer";
import { useDice } from "@/hooks/useDice";
import { calculateResult } from "@/lib/gameLogic";
import { playTimerWarning } from "@/lib/sounds";

export default function Home() {
  const {
    state,
    startGame,
    handleDiceRoll,
    handleAnswer,
    handleQuizDismiss,
    endGame,
    updateTimeRemaining,
    resetGame,
  } = useGameState();

  const timer = useTimer();
  const dice = useDice();

  // Start game handler
  const onStartGame = useCallback(() => {
    startGame();
    timer.start();
  }, [startGame, timer]);

  // Sync timer to game state
  useEffect(() => {
    updateTimeRemaining(timer.timeRemaining);
  }, [timer.timeRemaining, updateTimeRemaining]);

  // Pause timer during quiz
  useEffect(() => {
    if (state.phase === "quiz") {
      timer.pause();
    } else if (state.phase === "playing") {
      timer.resume();
    }
  }, [state.phase, timer]);

  // Timer expired
  useEffect(() => {
    if (timer.isExpired && state.phase === "playing") {
      endGame(0);
    }
  }, [timer.isExpired, state.phase, endGame]);

  // Timer warning sound
  useEffect(() => {
    if (timer.isWarning && timer.timeRemaining % 10 === 0 && state.phase === "playing") {
      playTimerWarning();
    }
  }, [timer.isWarning, timer.timeRemaining, state.phase]);

  // Dice roll handler
  const onDiceRoll = useCallback(async () => {
    if (state.phase !== "playing" || state.isMoving || dice.isRolling) return;
    const value = await dice.roll(state.playerPosition);
    await handleDiceRoll(value);
  }, [state.phase, state.isMoving, state.playerPosition, dice, handleDiceRoll]);

  // Play again handler
  const onPlayAgain = useCallback(() => {
    resetGame();
    dice.reset();
    timer.reset();
  }, [resetGame, dice, timer]);

  // Calculate result for result screen
  const gameResult =
    state.phase === "result" ? calculateResult(state) : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#fff5f8]">
      {/* Start Screen */}
      <AnimatePresence>
        {state.phase === "start" && <StartScreen onStart={onStartGame} />}
      </AnimatePresence>

      {/* Game Header */}
      {state.phase !== "start" && (
        <GameHeader
          formattedTime={timer.formattedTime}
          score={state.score}
          correctAnswers={state.correctAnswers}
          totalQuestions={state.totalQuestions}
          isWarning={timer.isWarning}
        />
      )}

      {/* Main Game Area */}
      {state.phase !== "start" && (
        <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-start lg:justify-center gap-4 lg:gap-8 px-4 pb-4 pt-0 lg:px-8 lg:pb-8 lg:pt-2 min-h-0">
          {/* Board */}
          <div className="flex flex-col items-start w-full min-h-0 shrink" style={{ maxWidth: 'min(100%, 80vh, 720px)' }}>
            <h2 className="text-xl md:text-2xl text-pink-950 font-heading font-bold text-left w-full mt-0 mb-2 shrink-0">
              Electrical Safety
            </h2>
            <div className="w-full shrink min-h-0 aspect-square">
              <GameBoard playerPosition={state.playerPosition} />
            </div>
          </div>

          {/* Controls panel */}
          <div className="flex flex-row lg:flex-col items-center justify-center lg:self-center gap-4 lg:gap-6 shrink-0 lg:w-48 mt-4 lg:mt-0">
            <Dice
              value={dice.value}
              isRolling={dice.isRolling}
              onRoll={onDiceRoll}
              disabled={
                state.phase !== "playing" || state.isMoving
              }
            />

            {/* Position indicator */}
            <div className="text-center bg-white rounded-xl px-4 py-2 lg:px-6 lg:py-3 border border-pink-200 shadow-sm">
              <div className="text-[10px] lg:text-xs text-pink-500 font-heading uppercase tracking-wider">
                Position
              </div>
              <div className="font-heading font-bold text-xl lg:text-2xl text-pink-950">
                {state.playerPosition}
                <span className="text-pink-400 text-xs lg:text-sm font-normal">
                  /36
                </span>
              </div>
            </div>

            {/* Last roll */}
            {dice.value && !dice.isRolling && (
              <div className="text-center">
                <div className="text-[10px] lg:text-xs text-pink-500 font-heading uppercase tracking-wider">
                  Last Roll
                </div>
                <div className="font-heading font-bold text-lg lg:text-xl text-pink-700">
                  {dice.value}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quiz Popup */}
      <AnimatePresence>
        {state.phase === "quiz" && state.currentQuestion && (
          <QuizPopup
            question={state.currentQuestion}
            isSnakeQuiz={state.isSnakeQuiz}
            onAnswer={handleAnswer}
            onDismiss={handleQuizDismiss}
          />
        )}
      </AnimatePresence>

      {/* Result Screen */}
      <AnimatePresence>
        {state.phase === "result" && gameResult && (
          <ResultScreen result={gameResult} onPlayAgain={onPlayAgain} />
        )}
      </AnimatePresence>
    </div>
  );
}
