"use client";

import { motion } from "framer-motion";
import { getCellPosition } from "@/lib/boardConfig";

interface PlayerTokenProps {
  position: number;
}

export default function PlayerToken({ position }: PlayerTokenProps) {
  const pos = getCellPosition(position);

  return (
    <motion.g
      animate={{ x: pos.x, y: pos.y }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.8,
      }}
    >
      {/* Shadow */}
      <ellipse cx={2} cy={16} rx={10} ry={4} fill="rgba(0,0,0,0.3)" />

      {/* Hard hat body */}
      <path
        d="M -12 4 Q -12 -10 0 -14 Q 12 -10 12 4 L 14 6 L -14 6 Z"
        fill="#fbbf24"
        stroke="#d97706"
        strokeWidth="1.5"
      />

      {/* Brim */}
      <ellipse cx={0} cy={6} rx={16} ry={4} fill="#f59e0b" stroke="#d97706" strokeWidth="1" />

      {/* Highlight */}
      <path
        d="M -6 -8 Q -2 -14 4 -10"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Face */}
      <circle cx={0} cy={10} r={8} fill="#fde68a" stroke="#d97706" strokeWidth="0.5" />

      {/* Eyes */}
      <circle cx={-3} cy={9} r={1.2} fill="#1e3a5f" />
      <circle cx={3} cy={9} r={1.2} fill="#1e3a5f" />

      {/* Smile */}
      <path
        d="M -3 12 Q 0 14 3 12"
        fill="none"
        stroke="#92400e"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </motion.g>
  );
}
