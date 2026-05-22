import { motion } from "framer-motion";
import { getCellPosition } from "@/lib/boardConfig";
import { assetUrl } from "@/lib/assets";

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
        <motion.image
          href={assetUrl("images/player-icon.png")}
          xlinkHref={assetUrl("images/player-icon.png")}
          x={-25}
          y={-25}
          width={50}
          height={50}
          preserveAspectRatio="xMidYMid meet"
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.g>
    </motion.g>
  );
}
