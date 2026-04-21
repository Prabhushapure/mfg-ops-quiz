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
        stiffness: 140,
        damping: 24,
        mass: 1.2,
      }}
    >
      <motion.g
        animate={{ y: [0, -2.5, 0] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Keep a subtle drop shadow for contrast on dark cells */}
        <ellipse cx={1} cy={19} rx={11} ry={4} fill="rgba(0,0,0,0.35)" />

        {/* Player icon */}
        <image
          href="/snake/images/player-icon.png"
          xlinkHref="/snake/images/player-icon.png"
          x={-25}
          y={-25}
          width={50}
          height={50}
          preserveAspectRatio="xMidYMid meet"
        />
      </motion.g>
    </motion.g>
  );
}
