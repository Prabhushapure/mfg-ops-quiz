import { motion } from "framer-motion";
import { assetUrl } from "@/lib/assets";
import { GAME_DURATION } from "@/lib/gameLogic";

interface GameHeaderProps {
  formattedTime: string;
  timeRemaining: number;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  isWarning: boolean;
}

function HudBadge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex skew-x-[-14deg] rounded-sm bg-safety-yellow px-3 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.35)] sm:px-4 ${className}`}
    >
      <div className="inline-flex skew-x-[14deg] items-center gap-1.5 font-heading font-bold text-sm text-navy-950 sm:text-base">
        {children}
      </div>
    </div>
  );
}

export default function GameHeader({
  formattedTime,
  timeRemaining,
  score,
  correctAnswers,
  totalQuestions,
  isWarning,
}: GameHeaderProps) {
  const progress = Math.max(0, Math.min(100, (timeRemaining / GAME_DURATION) * 100));

  return (
    <header className="w-full bg-navy-950">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <h1 className="font-heading text-base font-bold uppercase tracking-wide text-left leading-tight sm:text-xl md:text-2xl">
          <span className="text-safety-orange">MFG</span>{" "}
          <span className="text-white">OPERATIONS QUIZ</span>
        </h1>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <HudBadge>
            <span>
              {correctAnswers}/{totalQuestions || 0}
            </span>
          </HudBadge>

          <HudBadge>
            <img
              src={assetUrl("hud-score-icon.png")}
              alt=""
              width={20}
              height={20}
              className="h-4 w-4 sm:h-5 sm:w-5"
              aria-hidden
            />
            <span>{score}</span>
          </HudBadge>

          <HudBadge className={isWarning ? "bg-safety-red" : ""}>
            <img
              src={assetUrl("hud-timer-icon.png")}
              alt=""
              width={20}
              height={20}
              className="h-4 w-4 sm:h-5 sm:w-5"
              aria-hidden
            />
            <motion.span
              animate={isWarning ? { scale: [1, 1.08, 1] } : {}}
              transition={isWarning ? { duration: 0.8, repeat: Infinity } : {}}
            >
              {formattedTime}
            </motion.span>
          </HudBadge>
        </div>
      </div>

      <div className="h-1 w-full bg-navy-900">
        <motion.div
          className="h-full bg-safety-orange"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "linear" }}
        />
      </div>
    </header>
  );
}
