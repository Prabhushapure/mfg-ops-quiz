import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { QuizQuestion } from "@/types/game";
import { assetUrl } from "@/lib/assets";

interface QuizPopupProps {
  question: QuizQuestion;
  isSnakeQuiz: boolean;
  onAnswer: (answer: "A" | "B" | "C" | "D") => Promise<
    { isCorrect: boolean } | undefined
  >;
  onDismiss: (isCorrect: boolean) => void;
}

const optionLabels: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];

export default function QuizPopup({
  question,
  isSnakeQuiz,
  onAnswer,
  onDismiss,
}: QuizPopupProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<
    "A" | "B" | "C" | "D" | null
  >(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = useCallback(
    async (answer: "A" | "B" | "C" | "D") => {
      if (selectedAnswer) return; // Already answered
      setSelectedAnswer(answer);

      const result = await onAnswer(answer);
      if (result) {
        setIsCorrect(result.isCorrect);
        setShowResult(true);

        // Auto-dismiss after 2.5 seconds
        setTimeout(() => {
          onDismiss(result.isCorrect);
        }, 2500);
      }
    },
    [selectedAnswer, onAnswer, onDismiss]
  );

  const getOptionStyle = (label: "A" | "B" | "C" | "D") => {
    if (!showResult) {
      return "bg-navy-800 border-navy-600 hover:border-safety-yellow hover:bg-navy-700 cursor-pointer";
    }
    if (label === question.correctAnswer) {
      return "bg-green-900/40 border-green-500 text-green-300";
    }
    if (label === selectedAnswer && !isCorrect) {
      return "bg-red-900/40 border-red-500 text-red-300";
    }
    return "bg-navy-800/50 border-navy-700 opacity-50";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={(e) => {
          if (showResult && e.target === e.currentTarget) {
            onDismiss(isCorrect ?? false);
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-navy-900 border border-navy-600 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div
            className={`px-6 py-3 rounded-t-2xl ${
              isSnakeQuiz
                ? "bg-gradient-to-r from-red-900/50 to-red-800/30"
                : "bg-gradient-to-r from-green-900/50 to-green-800/30"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {isSnakeQuiz ? "🐍" : "🪜"}
              </span>
              <span className="font-heading font-bold text-sm uppercase tracking-wider text-white">
                {isSnakeQuiz
                  ? "Snake Challenge — Answer correctly to stay!"
                  : "Ladder Challenge — Answer correctly to climb!"}
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* Image */}
            {question.image && (
              <div className="mb-4 rounded-lg overflow-hidden bg-navy-800 border border-navy-700">
                <img
                  src={assetUrl(`images/quiz/${question.image}`)}
                  alt="Quiz question image"
                  width={500}
                  height={300}
                  className="w-full h-40 sm:h-52 object-cover"
                />
              </div>
            )}

            {/* Question */}
            <p className="text-white text-base sm:text-lg font-medium mb-6 leading-relaxed">
              {question.question}
            </p>

            {/* Options */}
            <div className="space-y-3 mb-4">
              {optionLabels.map((label, i) => (
                <motion.button
                  key={label}
                  onClick={() => handleSelect(label)}
                  disabled={!!selectedAnswer}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all
                    text-sm sm:text-base font-medium ${getOptionStyle(label)}`}
                  whileHover={!selectedAnswer ? { scale: 1.01 } : {}}
                  whileTap={!selectedAnswer ? { scale: 0.99 } : {}}
                >
                  <span className="font-heading font-bold text-safety-yellow mr-3">
                    {label}.
                  </span>
                  {question.options[i].replace(/^[A-D]\.\s*/, "")}
                </motion.button>
              ))}
            </div>

            {/* Result feedback */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className={`rounded-xl p-4 mt-4 ${
                    isCorrect
                      ? "bg-green-900/30 border border-green-700"
                      : "bg-red-900/30 border border-red-700"
                  }`}
                >
                  <p
                    className={`font-heading font-bold text-sm uppercase tracking-wider mb-1 ${
                      isCorrect ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </p>
                  <p className="text-steel-300 text-sm">
                    {question.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {!selectedAnswer && (
              <p className="text-center text-xs text-steel-500 mt-4">
                Select the correct answer
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
