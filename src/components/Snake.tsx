"use client";

import { getCellPosition } from "@/lib/boardConfig";
import { SnakeOrLadder } from "@/types/game";

interface StripeStyle {
  color: string;
  dashArray: string;
  dashOffset: string;
}

interface SnakeStyle {
  bodyWidth: number;
  bodyColor: string;
  stripes: StripeStyle[];
  outlineColor: string;
  headSize: number;
  curviness: number;
}

// All snakes follow a cohesive cartoon style similar to the provided image.
const SNAKE_STYLES: Record<string, SnakeStyle> = {
  "25-6": { // Red snake with black/white bands
    bodyWidth: 16,
    bodyColor: "#e30613",
    stripes: [
      { color: "#ffffff", dashArray: "10 30", dashOffset: "0" },
      { color: "#000000", dashArray: "10 30", dashOffset: "20" }
    ],
    outlineColor: "#222222",
    headSize: 15,
    curviness: 45,
  },
  "DEFAULT": { // Green snake with yellow bands
    bodyWidth: 16,
    bodyColor: "#5eb344",
    stripes: [
      { color: "#fadd00", dashArray: "12 24", dashOffset: "0" }
    ],
    outlineColor: "#222222",
    headSize: 15,
    curviness: 35,
  }
};

interface SnakeProps {
  snake: SnakeOrLadder;
}

export default function Snake({ snake }: SnakeProps) {
  const headPos = getCellPosition(snake.from);
  const tailPos = getCellPosition(snake.to);

  const styleKey = `${snake.from}-${snake.to}`;
  const style = SNAKE_STYLES[styleKey] || SNAKE_STYLES["DEFAULT"];

  const dx = tailPos.x - headPos.x;
  const midY = (headPos.y + tailPos.y) / 2;

  // S-curve with per-snake curviness. Give some random direction to curviness based on snake ID
  const direction = snake.from % 2 === 0 ? 1 : -1;
  const cp1x = headPos.x + dx * 0.3 + (style.curviness * direction);
  const cp1y = headPos.y + (midY - headPos.y) * 0.5;
  const cp2x = headPos.x + dx * 0.7 - (style.curviness * direction);
  const cp2y = midY + (tailPos.y - midY) * 0.5;

  const pathD = `M ${headPos.x} ${headPos.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${tailPos.x} ${tailPos.y}`;

  // Calculate face angle based on the vector from the first control point to the head
  const dxHead = headPos.x - cp1x;
  const dyHead = headPos.y - cp1y;
  const angle = Math.atan2(dyHead, dxHead) * (180 / Math.PI) + 90;

  const hs = style.headSize;

  return (
    <g className="pointer-events-none">
      {/* Outer black stroke for cartoon outline */}
      <path
        d={pathD}
        fill="none"
        stroke={style.outlineColor}
        strokeWidth={style.bodyWidth + 6}
        strokeLinecap="round"
      />

      {/* Snake body color */}
      <path
        d={pathD}
        fill="none"
        stroke={style.bodyColor}
        strokeWidth={style.bodyWidth}
        strokeLinecap="round"
      />

      {/* Snake stripes using stroke-dasharray */}
      {style.stripes.map((stripe, idx) => (
        <path
          key={idx}
          d={pathD}
          fill="none"
          stroke={stripe.color}
          strokeWidth={style.bodyWidth}
          strokeDasharray={stripe.dashArray}
          strokeDashoffset={stripe.dashOffset}
          strokeLinecap="butt"
        />
      ))}

      {/* Head */}
      <g transform={`translate(${headPos.x}, ${headPos.y}) rotate(${angle})`}>
        {/* Tongue */}
        <path
          d={`M 0 ${-hs * 0} L 0 ${-hs * 1.8} M 0 ${-hs * 1.8} L -4 ${-hs * 2.2} M 0 ${-hs * 1.8} L 4 ${-hs * 2.2}`}
          stroke="#e30613"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Head outline & fill */}
        <ellipse
          cx="0"
          cy={-hs * 0.2}
          rx={hs * 1.1}
          ry={hs * 1.25}
          fill={style.bodyColor}
          stroke={style.outlineColor}
          strokeWidth="3"
        />

        {/* Big White Eyes */}
        <circle cx={-hs * 0.55} cy={-hs * 0.7} r={hs * 0.45} fill="#ffffff" stroke={style.outlineColor} strokeWidth="2.5" />
        <circle cx={hs * 0.55} cy={-hs * 0.7} r={hs * 0.45} fill="#ffffff" stroke={style.outlineColor} strokeWidth="2.5" />

        {/* Black Pupils */}
        <circle cx={-hs * 0.55} cy={-hs * 0.75} r={hs * 0.15} fill="#000000" />
        <circle cx={hs * 0.55} cy={-hs * 0.75} r={hs * 0.15} fill="#000000" />
      </g>
    </g>
  );
}
