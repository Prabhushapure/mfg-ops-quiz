"use client";

import { motion } from "framer-motion";

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/95 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="text-center max-w-lg mx-4 p-8"
      >
        {/* Lightning icon */}
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl mb-4"
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            className="mx-auto"
          >
            <polygon
              points="45,5 20,40 35,40 25,75 60,35 42,35"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        <h1 className="font-heading text-5xl sm:text-6xl font-black text-white tracking-tight mb-2">
          SAFETY
          <span className="block text-safety-yellow">SCRAMBLE</span>
        </h1>

        <p className="font-heading text-lg text-steel-400 tracking-widest uppercase mb-8">
          Industrial Safety Quiz
        </p>

        <div className="bg-navy-800/60 rounded-xl p-6 mb-8 text-left border border-navy-700">
          <h2 className="font-heading font-bold text-safety-yellow text-sm uppercase tracking-wider mb-3">
            How to Play
          </h2>
          <ul className="space-y-2 text-sm text-steel-300">
            <li className="flex gap-2">
              <span className="text-safety-yellow font-bold">1.</span>
              Roll the dice and move across the board
            </li>
            <li className="flex gap-2">
              <span className="text-safety-yellow font-bold">2.</span>
              Land on a snake or ladder to trigger a quiz question
            </li>
            <li className="flex gap-2">
              <span className="text-safety-yellow font-bold">3.</span>
              <span>
                <strong className="text-white">Snakes:</strong> Answer correctly
                to stay, wrong to slide down
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-safety-yellow font-bold">4.</span>
              <span>
                <strong className="text-white">Ladders:</strong> Answer correctly
                to climb up, wrong to stay
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-safety-yellow font-bold">5.</span>
              Reach cell 36 with 80%+ score to pass!
            </li>
          </ul>
          <div className="mt-3 pt-3 border-t border-navy-600 text-xs text-steel-400">
            You have <strong className="text-white">10 minutes</strong>. Timer
            pauses during quiz questions.
          </div>
        </div>

        <motion.button
          onClick={onStart}
          className="px-10 py-4 bg-safety-yellow text-navy-950 font-heading font-black text-xl rounded-xl
                     shadow-lg shadow-yellow-900/30 hover:bg-yellow-400 active:bg-yellow-500
                     transition-colors uppercase tracking-wider"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Game
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
