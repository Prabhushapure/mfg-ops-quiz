"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { GameTopic } from "@/hooks/useGameState";

interface StartScreenProps {
  selectedTopic: GameTopic;
  onTopicChange: (topic: GameTopic) => void;
  onStart: () => void;
  disableTopicSelection?: boolean;
}

export default function StartScreen({
  selectedTopic,
  onTopicChange,
  onStart,
  disableTopicSelection = false,
}: StartScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/95 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="text-center max-w-lg w-full my-6 p-6 sm:p-8"
      >
        {/* Shield logo */}
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mb-0 leading-none"
        >
          <Image src="/snake/logo.png" alt="Shield logo" width={88} height={88} className="mx-auto h-20 w-20 sm:h-24 sm:w-24" priority />
        </motion.div>

        <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-white tracking-tight whitespace-nowrap mb-0">
          SAFETY <span className="text-safety-yellow">SCRAMBLE</span>
        </h1>

        <p className="font-heading text-base text-steel-400 tracking-widest uppercase mb-5">
          Industrial Safety Quiz
        </p>

        <div className="bg-navy-800/60 rounded-xl p-5 sm:p-6 mb-5 text-left border border-navy-700">
          <h2 className="font-heading font-bold text-safety-yellow text-sm uppercase tracking-wider mb-3">
            Play Instructions
          </h2>
          <ul className="space-y-1 text-sm leading-5 text-white">
            <li className="flex gap-2">
              <span className="text-steel-300 text-sm leading-6">▶</span>
              Select a Topic to play
            </li>
            <li className="flex gap-2">
              <span className="text-steel-300 text-sm leading-6">▶</span>
              Roll the dice and move across the board
            </li>
            <li className="flex gap-2">
              <span className="text-steel-300 text-sm leading-6">▶</span>
              Land on the snake or ladder to trigger a quiz question
            </li>
            <li className="flex gap-2">
              <span className="text-steel-300 text-sm leading-6">▶</span>
              Snakes: Answer correctly to stay, wrong to slide down
            </li>
            <li className="flex gap-2">
              <span className="text-steel-300 text-sm leading-6">▶</span>
              Ladders: Answer correctly to climb up, wrong to stay
            </li>
            <li className="flex gap-2">
              <span className="text-steel-300 text-sm leading-6">▶</span>
              Reach destination cell with 80% + score to PASS
            </li>
          </ul>
          <div className="mt-3 pt-3 border-t border-navy-600 text-sm text-white">
            Duration 10 minutes.
          </div>
        </div>

        <div className="mb-6 text-left">
          <label
            htmlFor="topic-select"
            className="block font-heading font-bold text-safety-yellow text-sm uppercase tracking-wider mb-2"
          >
            Select Topic
          </label>
          <select
            id="topic-select"
            value={selectedTopic}
            onChange={(e) => onTopicChange(e.target.value as GameTopic)}
            disabled={disableTopicSelection}
            className="w-full rounded-lg bg-navy-800 border border-navy-600 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-safety-yellow disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option value="electrical">Electrical Safety</option>
            <option value="fire">Fire Safety</option>
            <option value="safety-induction">Safety Induction</option>
            <option value="employee-responsibility">
              Employee Responsibility
            </option>
            <option value="machine-handling-safety">
              Machine Handling Safety
            </option>
            <option value="material-handling-safety">
              Material Handling Safety
            </option>
            <option value="ppe-safety">PPE Safety</option>
            <option value="chemical-handling-safety">
              Chemical Handling Safety
            </option>
            <option value="safety-management-system">
              Safety Management System
            </option>
            <option value="safety-orientation">Safety Orientation</option>
            <option value="safety-practices">Safety Practices</option>
            <option value="heavy-lifting-machinery-safety">
              Heavy Lifting Machinery Safety
            </option>
            <option value="general-road-safety">General Road Safety</option>
            <option value="gas-cylinder-safety">Gas Cylinder Safety</option>
            <option value="forklift-safety">Forklift Safety</option>
            <option value="factory-ergonomics-safety">
              Factory Ergonomics Safety
            </option>
            <option value="confined-space-safety">
              Confined Space Safety
            </option>
            <option value="compressed-air-safety">
              Compressed Air Safety
            </option>
            <option value="campus-road-safety">Campus Road Safety</option>
            <option value="working-at-heights-safety">
              Working at Heights Safety
            </option>
          </select>
        </div>

        <motion.button
          onClick={onStart}
          className="w-full max-w-[12rem] px-8 py-2.5 bg-safety-yellow text-navy-950 font-heading font-black text-xl rounded-xl
                     shadow-lg shadow-yellow-900/30 hover:bg-yellow-400 active:bg-yellow-500
                     transition-colors uppercase tracking-wider"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Play
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
