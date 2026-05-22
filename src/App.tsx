import { useEffect, useCallback, useRef, useMemo, useState } from "react";
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
import { useSearchParams } from "@/hooks/useSearchParams";
import { calculateResult } from "@/lib/gameLogic";
import { playTimerWarning } from "@/lib/sounds";
import { assetUrl } from "@/lib/assets";
import type { GameTopic } from "@/hooks/useGameState";

const TOPIC_LABEL_TO_KEY: Record<string, GameTopic> = {
  "manufacturing quality induction": "manufacturing-quality-induction",
  "quality in manufacturing": "quality-in-manufacturing",
  "inhouse quality systems": "inhouse-quality-systems",
  "methods in ensuring product quality": "methods-ensuring-product-quality",
  "quality targets": "quality-targets",
  "people roles in industrial quality": "people-roles-industrial-quality",
};

const PARTNER_LICENSE_URL =
  "https://antiz-digital.com/GamifiedLearning/partner/license";
const PLAY_BASE_URL = "https://antiz-digital.com/GamifiedLearning/play";
const PLAY_COMPLETE_API =
  "https://antiz-digital.com/GamifiedLearning/api/play/complete";

const TOPIC_KEY_TO_LABEL: Record<GameTopic, string> = {
  "manufacturing-quality-induction": "Manufacturing Quality Induction",
  "quality-in-manufacturing": "Quality in Manufacturing",
  "inhouse-quality-systems": "Inhouse Quality Systems",
  "methods-ensuring-product-quality": "Methods in Ensuring Product Quality",
  "quality-targets": "Quality Targets",
  "people-roles-industrial-quality": "People Roles in Industrial Quality",
};

function parseTopicFromUrlParam(topicParam: string | null): GameTopic | null {
  if (!topicParam) return null;

  const normalized = topicParam.trim().toLowerCase();
  if (!normalized) return null;

  return (
    TOPIC_LABEL_TO_KEY[normalized] ??
    TOPIC_LABEL_TO_KEY[normalized.replace(/[-_]+/g, " ")] ??
    (Object.values(TOPIC_LABEL_TO_KEY).includes(normalized as GameTopic)
      ? (normalized as GameTopic)
      : null)
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const splashVideoSources = [assetUrl("splash.mp4"), "/splash.mp4"];
  const [splashSourceIndex, setSplashSourceIndex] = useState(0);
  const splashVideoRef = useRef<HTMLVideoElement | null>(null);
  const splashTimerRef = useRef<number | null>(null);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const playNo = searchParams.get("play_no");
  const topicParam = searchParams.get("topic");
  const hasSubmittedRef = useRef(false);

  const {
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
  } = useGameState();

  const timer = useTimer();
  const dice = useDice();
  const urlTopic = useMemo(() => parseTopicFromUrlParam(topicParam), [topicParam]);
  const selectedTopicLabel = TOPIC_KEY_TO_LABEL[selectedTopic];

  useEffect(() => {
    if (urlTopic) {
      setSelectedTopic(urlTopic);
    }
  }, [urlTopic, setSelectedTopic]);

  useEffect(() => {
    if (!showSplash) {
      if (splashTimerRef.current) {
        window.clearTimeout(splashTimerRef.current);
        splashTimerRef.current = null;
      }
      return;
    }

    const videoEl = splashVideoRef.current;
    if (videoEl) {
      videoEl.currentTime = 0;
      videoEl.play().catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Splash video autoplay failed:", error);
      });
    }

    splashTimerRef.current = window.setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => {
      if (splashTimerRef.current) {
        window.clearTimeout(splashTimerRef.current);
        splashTimerRef.current = null;
      }
    };
  }, [showSplash]);

  const onStartGame = useCallback(() => {
    startGame(selectedTopic);
    timer.start();
  }, [startGame, selectedTopic, timer]);

  useEffect(() => {
    updateTimeRemaining(timer.timeRemaining);
  }, [timer.timeRemaining, updateTimeRemaining]);

  useEffect(() => {
    if (state.phase === "playing") {
      timer.resume();
    } else {
      timer.pause();
    }
  }, [state.phase, timer]);

  useEffect(() => {
    if (timer.isExpired && state.phase === "playing") {
      endGame(0);
    }
  }, [timer.isExpired, state.phase, endGame]);

  useEffect(() => {
    if (timer.isWarning && timer.timeRemaining % 10 === 0 && state.phase === "playing") {
      playTimerWarning();
    }
  }, [timer.isWarning, timer.timeRemaining, state.phase]);

  const onDiceRoll = useCallback(async () => {
    if (state.phase !== "playing" || state.isMoving || dice.isRolling) return;
    const value = await dice.roll(state.playerPosition);
    await handleDiceRoll(value);
  }, [state.phase, state.isMoving, state.playerPosition, dice, handleDiceRoll]);

  const onPlayAgain = useCallback(() => {
    resetGame();
    dice.reset();
    timer.reset();
  }, [resetGame, dice, timer]);

  const gameResult =
    state.phase === "result" ? calculateResult(state) : null;

  const submitScore = useCallback(async () => {
    if (!token || !playNo || !gameResult) return;

    try {
      const response = await fetch(PLAY_COMPLETE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          play_no: parseInt(playNo, 10),
          score: gameResult.scorePercentage,
          play_result: gameResult.passed ? "Pass" : "Fail",
        }),
      });

      if (!response.ok) {
        console.error("Play complete API failed:", response.status);
      }
    } catch (error) {
      console.error("Error submitting game score:", error);
    }
  }, [token, playNo, gameResult]);

  useEffect(() => {
    if (state.phase === "start") {
      hasSubmittedRef.current = false;
    }

    if (
      state.phase === "result" &&
      gameResult &&
      token &&
      playNo &&
      !hasSubmittedRef.current
    ) {
      hasSubmittedRef.current = true;
      void submitScore();
    }
  }, [state.phase, gameResult, token, playNo, submitScore]);

  const handleClose = useCallback(async () => {
    if (!hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      await submitScore();
    }

    if (!token) {
      window.location.href = PARTNER_LICENSE_URL;
      return;
    }

    window.location.href = `${PLAY_BASE_URL}?token=${encodeURIComponent(token)}`;
  }, [token, submitScore]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fff5f8]">
      <AnimatePresence>
        {showSplash && (
          <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top,#0f1b4d_0%,#050b28_55%,#020616_100%)]">
            <img
              src={assetUrl("logo.png")}
              alt="Shield logo"
              width={88}
              height={88}
              className="mb-3 h-20 w-20 sm:h-24 sm:w-24"
            />
            <h1 className="mb-5 text-center font-heading text-3xl font-semibold tracking-tight text-white sm:text-5xl mx-auto max-w-full px-4">
              INDUSTRY <span className="text-safety-yellow">QUALITY QUIZ</span>
            </h1>
            <div className="w-fit max-w-[100vw] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
              <video
                ref={splashVideoRef}
                className="h-[54vh] min-h-[340px] w-auto max-w-[100vw] scale-105 bg-black object-contain sm:h-[62vh]"
                autoPlay
                muted
                playsInline
                src={splashVideoSources[splashSourceIndex]}
                preload="auto"
                onEnded={() => setShowSplash(false)}
                onError={() => {
                  if (splashSourceIndex < splashVideoSources.length - 1) {
                    setSplashSourceIndex((prev) => prev + 1);
                    return;
                  }
                  setShowSplash(false);
                }}
              />
            </div>
          </div>
        )}
        {!showSplash && state.phase === "start" && (
          <StartScreen
            selectedTopic={selectedTopic}
            onTopicChange={setSelectedTopic}
            onStart={onStartGame}
            disableTopicSelection={Boolean(urlTopic)}
          />
        )}
      </AnimatePresence>

      {state.phase !== "start" && (
        <GameHeader
          formattedTime={timer.formattedTime}
          score={state.score}
          correctAnswers={state.correctAnswers}
          totalQuestions={state.totalQuestions}
          isWarning={timer.isWarning}
        />
      )}

      {state.phase !== "start" && (
        <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-start lg:justify-center gap-4 lg:gap-8 px-4 pb-4 pt-0 lg:px-8 lg:pb-8 lg:pt-2 min-h-0">
          <div className="flex flex-col items-start w-full min-h-0 shrink" style={{ maxWidth: "min(100%, 80vh, 720px)" }}>
            <h2 className="text-xl md:text-2xl text-pink-950 font-heading font-bold text-left w-full mt-0 mb-2 shrink-0">
              {selectedTopicLabel}
            </h2>
            <div className="w-full shrink min-h-0 aspect-square">
              <GameBoard playerPosition={state.playerPosition} />
            </div>
          </div>

          <div className="flex flex-row lg:flex-col items-center justify-center lg:self-center gap-4 lg:gap-6 shrink-0 lg:w-48 mt-4 lg:mt-0">
            <Dice
              value={dice.value}
              isRolling={dice.isRolling}
              onRoll={onDiceRoll}
              disabled={state.phase !== "playing" || state.isMoving}
            />

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

      <AnimatePresence>
        {state.phase === "result" && gameResult && (
          <ResultScreen
            result={gameResult}
            topicName={selectedTopicLabel}
            onPlayAgain={onPlayAgain}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
