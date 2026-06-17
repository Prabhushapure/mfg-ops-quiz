import { useState } from "react";
import { motion } from "framer-motion";
import GameTitle from "@/components/GameTitle";
import type { GameTopic } from "@/hooks/useGameState";
import { assetUrl } from "@/lib/assets";

interface StartScreenProps {
  selectedTopic: GameTopic | null;
  onTopicChange: (topic: GameTopic) => void;
  onStart: () => void;
  disableTopicSelection?: boolean;
}

const TOPIC_OPTIONS: { value: GameTopic; label: string }[] = [
  {
    value: "lean-manufacturing-shopfloor-productivity",
    label: "Lean Manufacturing & Shopfloor Productivity",
  },
  {
    value: "machine-operations-maintenance-awareness",
    label: "Machine Operations & Maintenance Awareness",
  },
  {
    value: "production-operations-materials-flow",
    label: "Production Operations & Materials Flow",
  },
  {
    value: "quality-control-defect-prevention",
    label: "Quality Control & Defect Prevention",
  },
  {
    value: "shopfloor-safety-industrial-ehs",
    label: "Shopfloor Safety & Industrial EHS",
  },
];

export default function StartScreen({
  selectedTopic,
  onTopicChange,
  onStart,
  disableTopicSelection = false,
}: StartScreenProps) {
  const [isFlipped, setIsFlipped] = useState(disableTopicSelection);

  const handleChangeTopic = () => {
    if (disableTopicSelection) return;
    setIsFlipped(false);
  };

  const selectedTopicLabel = TOPIC_OPTIONS.find(
    (option) => option.value === selectedTopic
  )?.label;

  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as GameTopic;
    if (!value) return;
    onTopicChange(value);
    setIsFlipped(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/95 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="text-center w-full my-6 px-4 sm:px-8">
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mb-0 leading-none"
        >
          <img
            src={assetUrl("logo.png")}
            alt="Shield logo"
            width={88}
            height={88}
            className="mx-auto h-20 w-20 sm:h-24 sm:w-24"
          />
        </motion.div>

        <GameTitle className="mb-5" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mx-auto w-full max-w-md"
          style={{ perspective: 1200 }}
        >
          <motion.div
            className="relative w-full"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Front — Select Topic */}
            <div
              className={`w-full max-w-sm mx-auto bg-navy-800/60 rounded-xl p-4 text-left border border-navy-700 ${
                isFlipped ? "absolute inset-x-0 top-0" : "relative"
              }`}
              style={{ backfaceVisibility: "hidden" }}
            >
              <h2 className="font-heading font-bold text-safety-yellow text-xs uppercase tracking-wider mb-2">
                Select Topic
              </h2>
              <select
                id="topic-select"
                value={selectedTopic ?? ""}
                onChange={handleTopicChange}
                disabled={disableTopicSelection}
                className="w-full rounded-lg bg-navy-800 border border-navy-600 text-white text-sm px-3 py-1.5 outline-none focus:ring-2 focus:ring-safety-yellow disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="" disabled>
                  Select a topic...
                </option>
                {TOPIC_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Back — Play Instructions */}
            <div
              className={`w-full bg-navy-800/60 rounded-xl p-5 sm:p-6 text-left border border-navy-700 ${
                isFlipped ? "relative" : "absolute inset-x-0 top-0"
              }`}
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <h2 className="font-heading font-bold text-safety-yellow text-sm uppercase tracking-wider mb-3">
                Play Instructions
              </h2>
              <ul className="space-y-1 text-sm leading-5 text-white">
                <li className="flex gap-2">
                  <span className="mt-1.5 inline-block h-0 w-0 shrink-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-white" />
                  Roll the dice and move across the board
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 inline-block h-0 w-0 shrink-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-white" />
                  Land on the snake or ladder to trigger a quiz question
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 inline-block h-0 w-0 shrink-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-white" />
                  Snakes: Answer correctly to stay, wrong to slide down
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 inline-block h-0 w-0 shrink-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-white" />
                  Ladders: Answer correctly to climb up, wrong to stay
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 inline-block h-0 w-0 shrink-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-white" />
                  Reach destination cell with 80% + score to PASS
                </li>
              </ul>
              <div className="mt-3 pt-3 border-t border-navy-600 text-sm text-white">
                Duration 10 minutes.
              </div>

              {selectedTopicLabel && (
                <div className="mt-4 text-center text-sm">
                  <p className="text-white">{selectedTopicLabel}</p>
                  {!disableTopicSelection && (
                    <button
                      type="button"
                      onClick={handleChangeTopic}
                      className="mt-1 text-safety-yellow hover:text-yellow-400 underline underline-offset-2 transition-colors"
                    >
                      Change topic
                    </button>
                  )}
                </div>
              )}

              <motion.button
                onClick={onStart}
                className="mt-4 w-full px-8 py-2.5 bg-safety-yellow text-navy-950 font-heading font-black text-xl rounded-xl
                           shadow-lg shadow-yellow-900/30 hover:bg-yellow-400 active:bg-yellow-500
                           transition-colors uppercase tracking-wider"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Play
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
