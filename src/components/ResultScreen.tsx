import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GameResult } from "@/types/game";
import { assetUrl } from "@/lib/assets";
import { playGameWin, playGameLose } from "@/lib/sounds";

function generateConfetti() {
  const colors = ["#fbbf24", "#22c55e", "#3b82f6", "#ef4444", "#a855f7"];
  return Array.from({ length: 30 }).map((_, i) => ({
    delay: i * 0.06,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: 720 + Math.random() * 360,
    duration: 2 + Math.random(),
  }));
}

interface ResultScreenProps {
  result: GameResult;
  topicName: string;
  onPlayAgain: () => void;
  onClose: () => void;
}

interface ConfettiPieceProps {
  delay: number;
  x: number;
  color: string;
  rotation: number;
  duration: number;
}

function ConfettiPiece({ delay, x, color, rotation, duration }: ConfettiPieceProps) {
  return (
    <motion.div
      className="absolute w-2 h-3 rounded-sm"
      style={{ backgroundColor: color, left: `${x}%`, top: -10 }}
      initial={{ y: -20, rotate: 0, opacity: 1 }}
      animate={{
        y: 600,
        rotate: rotation,
        opacity: [1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
    />
  );
}

export default function ResultScreen({
  result,
  topicName,
  onPlayAgain: _onPlayAgain,
  onClose,
}: ResultScreenProps) {
  useEffect(() => {
    if (result.passed) {
      playGameWin();
    } else {
      playGameLose();
    }
  }, [result.passed]);

  const [confettiPieces] = useState(generateConfetti);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/95 backdrop-blur-sm p-4 overflow-y-auto"
    >
      {/* Confetti for pass */}
      {result.passed && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {confettiPieces.map((piece, i) => (
            <ConfettiPiece key={i} {...piece} />
          ))}
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="text-center mb-2">
          <img
            src={assetUrl("logo.png")}
            alt="Shield logo"
            width={64}
            height={64}
            className="mx-auto mb-1 h-12 w-12"
          />
          <h1 className="font-heading text-3xl sm:text-5xl font-semibold text-white tracking-tight text-center mx-auto max-w-full">
            INDUSTRY <span className="text-safety-yellow">QUALITY QUIZ</span>
          </h1>
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-navy-800/60 rounded-2xl w-full shadow-2xl overflow-hidden backdrop-blur-sm"
        >
          {/* Pass/Fail banner */}
          <motion.div
            className={`py-5 text-center ${
              result.passed
                ? "bg-green-900/35"
                : "bg-red-900/35"
            }`}
            animate={{}}
            transition={{}}
          >
            <p className="text-safety-yellow text-sm mb-1 font-heading uppercase tracking-widest">
              {topicName}
            </p>
            <div className="flex items-center justify-center gap-3">
              <motion.h2
                className={`font-heading font-black text-5xl tracking-tight ${
                  result.passed ? "text-green-400" : "text-red-400"
                }`}
                animate={
                  !result.passed
                    ? { x: [0, -5, 5, -3, 3, 0] }
                    : {}
                }
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {result.passed ? "PASS" : "FAIL"}
              </motion.h2>
              <img
                src={assetUrl(result.passed ? "thumbs-up.png" : "thumbs-down.png")}
                alt={result.passed ? "Thumbs up" : "Thumbs down"}
                width={72}
                height={72}
                className="h-14 w-14 sm:h-[72px] sm:w-[72px]"
              />
            </div>
            <p className="text-steel-400 text-sm mt-0.5 font-heading uppercase tracking-wider">
              {result.passed
                ? "Excellent work, Safety Champion!"
                : "Keep studying and try again!"}
            </p>
          </motion.div>

          {/* Stats */}
          <div className="px-6 pb-5">
            <div className="space-y-2.5 mt-2">
              <StatRow
                label="Total Questions"
                value={result.totalQuestions.toString()}
              />
              <StatRow
                label="Correct Answers"
                value={result.correctAnswers.toString()}
                highlight="green"
              />
              <StatRow
                label="Wrong Answers"
                value={result.wrongAnswers.toString()}
                highlight={result.wrongAnswers > 0 ? "red" : undefined}
              />
              <StatRow
                label="Points Scored"
                value={result.pointsScored.toString()}
              />
              <StatRow
                label="Score Percentage"
                value={`${result.scorePercentage}%`}
                highlight={result.scorePercentage >= 80 ? "green" : "red"}
              />
              <StatRow
                label="Goal Reached (Cell 36)"
                value={result.goalReached ? "Yes" : "No"}
                highlight={result.goalReached ? "green" : "red"}
              />
              <StatRow
                label="Time Remaining"
                value={formatTime(result.timeRemaining)}
              />
              <div className="border-t border-navy-600 pt-2.5">
                <StatRow
                  label="Final Score"
                  value={result.finalScore.toLocaleString()}
                  large
                />
              </div>
            </div>

            <motion.button
              onClick={onClose}
              className="block w-full max-w-[12rem] mx-auto mt-5 px-8 py-2.5 bg-safety-yellow text-navy-950 font-heading font-black text-xl rounded-xl
                         shadow-lg shadow-yellow-900/30 hover:bg-yellow-400 active:bg-yellow-500
                         transition-colors uppercase tracking-wider"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatRow({
  label,
  value,
  highlight,
  large,
}: {
  label: string;
  value: string;
  highlight?: "green" | "red";
  large?: boolean;
}) {
  const valueColor =
    highlight === "green"
      ? "text-green-400"
      : highlight === "red"
        ? "text-red-400"
        : "text-white";

  return (
    <div className="flex justify-between items-center">
      <span
        className={`text-steel-400 ${large ? "font-heading font-bold text-base" : "text-sm"}`}
      >
        {label}
      </span>
      <span
        className={`font-heading font-bold ${large ? "text-2xl text-safety-yellow" : `text-base ${valueColor}`}`}
      >
        {value}
      </span>
    </div>
  );
}
