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
    const value = await dice.roll();
    await handleDiceRoll(value);
  }, [state.phase, state.isMoving, dice, handleDiceRoll]);

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
    <div className="min-h-screen flex flex-col bg-navy-950">
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
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 p-4 lg:p-8">
          {/* Board */}
          <div className="w-full max-w-[560px]">
            <GameBoard playerPosition={state.playerPosition} />
          </div>

          {/* Controls panel */}
          <div className="flex flex-col items-center gap-6 lg:w-48">
            <Dice
              value={dice.value}
              isRolling={dice.isRolling}
              onRoll={onDiceRoll}
              disabled={
                state.phase !== "playing" || state.isMoving
              }
            />

            {/* Position indicator */}
            <div className="text-center bg-navy-800/60 rounded-xl px-6 py-3 border border-navy-700">
              <div className="text-xs text-steel-400 font-heading uppercase tracking-wider">
                Position
              </div>
              <div className="font-heading font-bold text-2xl text-white">
                {state.playerPosition}
                <span className="text-steel-500 text-sm font-normal">
                  /36
                </span>
              </div>
            </div>

            {/* Last roll */}
            {dice.value && !dice.isRolling && (
              <div className="text-center">
                <div className="text-xs text-steel-400 font-heading uppercase tracking-wider">
                  Last Roll
                </div>
                <div className="font-heading font-bold text-xl text-safety-yellow">
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
