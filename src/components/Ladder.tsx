"use client";

import { getCellPosition } from "@/lib/boardConfig";
import { SnakeOrLadder } from "@/types/game";

interface LadderProps {
  ladder: SnakeOrLadder;
}

export default function Ladder({ ladder }: LadderProps) {
  const bottomPos = getCellPosition(ladder.from);
  const topPos = getCellPosition(ladder.to);

  let dx = topPos.x - bottomPos.x;
const dy = topPos.y - bottomPos.y;

// Force slight tilt if ladder is too straight
if (Math.abs(dx) < 5) {
  const tilt = 18; // adjust (10–25 for more/less tilt)

  // Alternate direction so all ladders don't tilt same way
  dx = ladder.from % 2 === 0 ? tilt : -tilt;
}
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  // Perpendicular offset for rail width
  const railSpacing = 14;
  const perpX = Math.sin(angle) * railSpacing;
  const perpY = -Math.cos(angle) * railSpacing;

  // Rail coordinates
  const leftRailStart = {
    x: bottomPos.x - perpX,
    y: bottomPos.y - perpY,
  };
  const leftRailEnd = { x: topPos.x - perpX, y: topPos.y - perpY };
  const rightRailStart = {
    x: bottomPos.x + perpX,
    y: bottomPos.y + perpY,
  };
  const rightRailEnd = { x: topPos.x + perpX, y: topPos.y + perpY };

  // Calculate rungs
  const rungCount = Math.max(3, Math.floor(length / 30));
  const rungs = [];
  for (let i = 1; i <= rungCount; i++) {
    const t = i / (rungCount + 1);
    rungs.push({
      x1: leftRailStart.x + (leftRailEnd.x - leftRailStart.x) * t,
      y1: leftRailStart.y + (leftRailEnd.y - leftRailStart.y) * t,
      x2: rightRailStart.x + (rightRailEnd.x - rightRailStart.x) * t,
      y2: rightRailStart.y + (rightRailEnd.y - rightRailStart.y) * t,
    });
  }

  const ladderId = `ladder-${ladder.from}-${ladder.to}`;

  return (
    <g className="pointer-events-none">
      <defs>
        <linearGradient
          id={`${ladderId}-grad`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <line
        x1={leftRailStart.x + 2}
        y1={leftRailStart.y + 2}
        x2={leftRailEnd.x + 2}
        y2={leftRailEnd.y + 2}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1={rightRailStart.x + 2}
        y1={rightRailStart.y + 2}
        x2={rightRailEnd.x + 2}
        y2={rightRailEnd.y + 2}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Rails */}
      <line
        x1={leftRailStart.x}
        y1={leftRailStart.y}
        x2={leftRailEnd.x}
        y2={leftRailEnd.y}
        stroke={`url(#${ladderId}-grad)`}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1={rightRailStart.x}
        y1={rightRailStart.y}
        x2={rightRailEnd.x}
        y2={rightRailEnd.y}
        stroke={`url(#${ladderId}-grad)`}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Rungs */}
      {rungs.map((rung, i) => (
        <g key={i}>
          <line
            x1={rung.x1 + 1}
            y1={rung.y1 + 1}
            x2={rung.x2 + 1}
            y2={rung.y2 + 1}
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1={rung.x1}
            y1={rung.y1}
            x2={rung.x2}
            y2={rung.y2}
            stroke="#cbd5e1"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* Safety yellow accents at top and bottom */}
      <circle cx={bottomPos.x} cy={bottomPos.y} r="4" fill="#fbbf24" opacity={0.6} />
      <circle cx={topPos.x} cy={topPos.y} r="4" fill="#22c55e" opacity={0.6} />
    </g>
  );
}
