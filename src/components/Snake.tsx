"use client";

import { getCellPosition } from "@/lib/boardConfig";
import { SnakeOrLadder } from "@/types/game";

interface SnakeProps {
  snake: SnakeOrLadder;
}

export default function Snake({ snake }: SnakeProps) {
  const headPos = getCellPosition(snake.from);
  const tailPos = getCellPosition(snake.to);

  // Create a smooth S-curve between head and tail
  const dx = tailPos.x - headPos.x;
  const midY = (headPos.y + tailPos.y) / 2;

  // Control points for S-curve
  const cp1x = headPos.x + dx * 0.3 + 30;
  const cp1y = headPos.y + (midY - headPos.y) * 0.5;
  const cp2x = headPos.x + dx * 0.7 - 30;
  const cp2y = midY + (tailPos.y - midY) * 0.5;

  const pathD = `M ${headPos.x} ${headPos.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${tailPos.x} ${tailPos.y}`;

  const snakeId = `snake-${snake.from}-${snake.to}`;
  const gradientId = `grad-${snakeId}`;
  const patternId = `pattern-${snakeId}`;

  return (
    <g className="pointer-events-none">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="50%" stopColor="#991b1b" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width="8"
          height="8"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="8"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="3"
          />
        </pattern>
      </defs>

      {/* Shadow */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="14"
        strokeLinecap="round"
        transform="translate(2, 2)"
      />

      {/* Body */}
      <path
        d={pathD}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Scale pattern overlay */}
      <path
        d={pathD}
        fill="none"
        stroke={`url(#${patternId})`}
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Body highlight (lighter edge) */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Head - diamond shape */}
      <g transform={`translate(${headPos.x}, ${headPos.y})`}>
        <polygon
          points="0,-10 8,-2 0,6 -8,-2"
          fill="#dc2626"
          stroke="#7f1d1d"
          strokeWidth="1"
        />
        {/* Eyes */}
        <circle cx="-3" cy="-3" r="1.5" fill="#fbbf24" />
        <circle cx="3" cy="-3" r="1.5" fill="#fbbf24" />
        <circle cx="-3" cy="-3" r="0.7" fill="#000" />
        <circle cx="3" cy="-3" r="0.7" fill="#000" />
        {/* Tongue */}
        <path
          d="M 0 4 L -3 10 M 0 4 L 3 10"
          stroke="#dc2626"
          strokeWidth="1"
          fill="none"
        />
      </g>
    </g>
  );
}
