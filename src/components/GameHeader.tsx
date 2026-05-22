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
      <div className="max-w-4xl mx-auto grid grid-cols-3 items-center gap-2 min-h-10">
        {/* Title — left */}
        <h1 className="font-heading font-semibold text-xs sm:text-lg text-white tracking-tight text-left leading-tight">
          INDUSTRY <span className="text-safety-yellow">QUALITY QUIZ</span>
        </h1>

        {/* Timer — center */}
        <motion.div
          className={`justify-self-center flex items-center gap-2 px-3 py-1.5 sm:px-4 rounded-lg font-heading font-bold text-lg sm:text-xl
            ${isWarning ? "bg-safety-red/20 text-safety-red" : "bg-navy-800 text-white"}`}
          animate={isWarning ? { scale: [1, 1.05, 1] } : {}}
          transition={isWarning ? { duration: 1, repeat: Infinity } : {}}
        >
          <img src={assetUrl("logo.png")} alt="Shield logo" width={24} height={24} className="h-6 w-6" />
          {formattedTime}
        </motion.div>

        {/* Score — right */}
        <div className="justify-self-end flex items-center gap-3 sm:gap-4">
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
