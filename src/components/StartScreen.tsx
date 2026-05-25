import { motion } from "framer-motion";
import GameTitle from "@/components/GameTitle";
import type { GameTopic } from "@/hooks/useGameState";
import { assetUrl } from "@/lib/assets";

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
      <div className="text-center w-full my-6 px-4 sm:px-8">
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mb-0 leading-none"
        >
          <img src={assetUrl("logo.png")} alt="Shield logo" width={88} height={88} className="mx-auto h-20 w-20 sm:h-24 sm:w-24" />
        </motion.div>

        <GameTitle className="mb-5" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mx-auto w-full max-w-lg"
        >
        <div className="bg-navy-800/60 rounded-xl p-5 sm:p-6 mb-5 text-left border border-navy-700">
          <h2 className="font-heading font-bold text-safety-yellow text-sm uppercase tracking-wider mb-3">
            Play Instructions
          </h2>
          <ul className="space-y-1 text-sm leading-5 text-white">
            <li className="flex gap-2">
              <span className="mt-1.5 inline-block h-0 w-0 shrink-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-white" />
              Select a Topic to play
            </li>
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
            <option value="quality-in-manufacturing">
              Quality in Manufacturing
            </option>
            <option value="inhouse-quality-systems">
              Inhouse Quality Systems
            </option>
            <option value="methods-ensuring-product-quality">
              Methods in Ensuring Product Quality
            </option>
            <option value="quality-targets">Quality Targets</option>
            <option value="people-roles-industrial-quality">
              People Roles in Industrial Quality
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
      </div>
    </motion.div>
  );
}
