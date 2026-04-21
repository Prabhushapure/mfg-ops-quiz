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
      {/* Keep a subtle drop shadow for contrast on dark cells */}
      <ellipse cx={1} cy={19} rx={11} ry={4} fill="rgba(0,0,0,0.35)" />

      {/* Player icon */}
      <image
        href="/snake/images/player-icon.png"
        xlinkHref="/snake/images/player-icon.png"
        x={-18}
        y={-18}
        width={36}
        height={36}
        preserveAspectRatio="xMidYMid meet"
      />
    </motion.g>
  );
}
