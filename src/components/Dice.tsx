"use client";

import { motion, AnimatePresence } from "framer-motion";

interface DiceProps {
  value: number | null;
  isRolling: boolean;
  onRoll: () => void;
  disabled: boolean;
}

function DiceDots({ value }: { value: number }) {
  const dotPositions: Record<number, [number, number][]> = {
    1: [[25, 25]],
    2: [
      [12, 12],
      [38, 38],
    ],
    3: [
      [12, 12],
      [25, 25],
      [38, 38],
    ],
    4: [
      [12, 12],
      [38, 12],
      [12, 38],
      [38, 38],
    ],
    5: [
      [12, 12],
      [38, 12],
      [25, 25],
      [12, 38],
      [38, 38],
    ],
    6: [
      [12, 10],
      [38, 10],
      [12, 25],
      [38, 25],
      [12, 40],
      [38, 40],
    ],
  };

  const dots = dotPositions[value] || [];

  return (
    <>
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={4.5} fill="#1e293b" />
      ))}
    </>
  );
}

export default function Dice({ value, isRolling, onRoll, disabled }: DiceProps) {
  const displayValue = value || 1;

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        onClick={onRoll}
        disabled={disabled || isRolling}
        className="relative cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        whileHover={!disabled && !isRolling ? { scale: 1.05 } : {}}
        whileTap={!disabled && !isRolling ? { scale: 0.95 } : {}}
      >
        <motion.svg
          width="70"
          height="70"
          viewBox="0 0 50 50"
          animate={
            isRolling
              ? {
                  rotate: [0, 15, -15, 10, -10, 5, 0],
                  scale: [1, 1.1, 0.95, 1.05, 1],
                }
              : { rotate: 0, scale: 1 }
          }
          transition={
            isRolling
              ? { duration: 0.5, ease: "easeOut" }
              : { type: "spring", stiffness: 200 }
          }
          style={{
            filter: "drop-shadow(2px 3px 4px rgba(0,0,0,0.4))",
          }}
        >
          {/* Dice body */}
          <rect
            x="1"
            y="1"
            width="48"
            height="48"
            rx="8"
            ry="8"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          {/* Subtle 3D edge */}
          <rect
            x="1"
            y="1"
            width="48"
            height="48"
            rx="8"
            ry="8"
            fill="url(#dice-gradient)"
          />
          <defs>
            <linearGradient
              id="dice-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.05)" />
            </linearGradient>
          </defs>

          <AnimatePresence mode="wait">
            <motion.g
              key={isRolling ? "rolling" : displayValue}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
            >
              <DiceDots value={displayValue} />
            </motion.g>
          </AnimatePresence>
        </motion.svg>
      </motion.button>

      <motion.button
        onClick={onRoll}
        disabled={disabled || isRolling}
        className="px-5 py-2.5 bg-safety-yellow text-navy-950 font-heading font-bold text-sm rounded-lg
                   disabled:opacity-40 disabled:cursor-not-allowed
                   hover:bg-yellow-400 active:bg-yellow-500 transition-colors
                   shadow-lg shadow-yellow-900/20 uppercase tracking-wider"
        whileHover={!disabled && !isRolling ? { scale: 1.03 } : {}}
        whileTap={!disabled && !isRolling ? { scale: 0.97 } : {}}
      >
        {isRolling ? "Rolling..." : "Roll Dice"}
      </motion.button>
    </div>
  );
}
