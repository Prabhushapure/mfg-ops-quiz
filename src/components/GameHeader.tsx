import { motion } from "framer-motion";
import { assetUrl } from "@/lib/assets";

interface GameHeaderProps {
  formattedTime: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  isWarning: boolean;
}

export default function GameHeader({
  formattedTime,
  score,
  correctAnswers,
  totalQuestions,
  isWarning,
}: GameHeaderProps) {
  return (
    <div className="w-full bg-navy-900/80 backdrop-blur-sm border-b border-navy-700 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Title */}
        <div className="hidden sm:block">
          <h1 className="font-heading font-semibold text-lg text-white tracking-tight whitespace-nowrap">
            SAFETY <span className="text-safety-yellow">SCRAMBLE</span>
          </h1>
        </div>

        {/* Timer */}
        <motion.div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-heading font-bold text-xl
            ${isWarning ? "bg-safety-red/20 text-safety-red" : "bg-navy-800 text-white"}`}
          animate={isWarning ? { scale: [1, 1.05, 1] } : {}}
          transition={isWarning ? { duration: 1, repeat: Infinity } : {}}
        >
          <img src={assetUrl("logo.png")} alt="Shield logo" width={24} height={24} className="h-6 w-6" />
          {formattedTime}
        </motion.div>

        {/* Score */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-xs text-steel-400 uppercase tracking-wider font-heading">
              Score
            </div>
            <div className="font-heading font-bold text-lg text-safety-yellow">
              {score}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-steel-400 uppercase tracking-wider font-heading">
              Correct
            </div>
            <div className="font-heading font-bold text-lg text-white">
              {correctAnswers}/{totalQuestions}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
