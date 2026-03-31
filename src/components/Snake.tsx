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
  waveCount?: number;
  waveDirection?: number;
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
    curviness: 25,
    waveCount: 3.5,
    waveDirection: 1,
  },
  "34-12": { // Blue snake
    bodyWidth: 15,
    bodyColor: "#009fe3",
    stripes: [{ color: "#ffffff", dashArray: "8 24", dashOffset: "0" }],
    outlineColor: "#222222",
    headSize: 14,
    curviness: 20,
    waveCount: 2.5,
    waveDirection: -1,
  },
  "22-3": { // Purple snake
    bodyWidth: 16,
    bodyColor: "#95288b",
    stripes: [{ color: "#ffb6c1", dashArray: "12 28", dashOffset: "0" }],
    outlineColor: "#222222",
    headSize: 15,
    curviness: 25,
    waveCount: 2,
    waveDirection: 1,
  },
  "16-8": { // Orange snake
    bodyWidth: 14,
    bodyColor: "#f39200",
    stripes: [{ color: "#ffcc00", dashArray: "10 20", dashOffset: "0" }],
    outlineColor: "#222222",
    headSize: 13,
    curviness: 15,
    waveCount: 1.5,
    waveDirection: -1,
  },
  "31-19": { // Yellow snake
    bodyWidth: 17,
    bodyColor: "#ffcc00",
    stripes: [{ color: "#f39200", dashArray: "14 24", dashOffset: "0" }],
    outlineColor: "#222222",
    headSize: 16,
    curviness: 22,
    waveCount: 2,
    waveDirection: 1,
  },
  "20-9": { // Pink snake
    bodyWidth: 15,
    bodyColor: "#e4007c",
    stripes: [
      { color: "#ffffff", dashArray: "8 24", dashOffset: "0" },
      { color: "#95288b", dashArray: "8 24", dashOffset: "8" }
    ],
    outlineColor: "#222222",
    headSize: 14,
    curviness: 20,
    waveCount: 1.5,
    waveDirection: -1,
  },
  "33-15": { // Cyan snake
    bodyWidth: 13,
    bodyColor: "#00aeef",
    stripes: [{ color: "#1c2640", dashArray: "10 24", dashOffset: "0" }],
    outlineColor: "#222222",
    headSize: 12,
    curviness: 18,
    waveCount: 2.5,
    waveDirection: 1,
  },
  "28-17": { // Dark Green snake
    bodyWidth: 16,
    bodyColor: "#006400",
    stripes: [{ color: "#a8cc1c", dashArray: "12 26", dashOffset: "0" }],
    outlineColor: "#222222",
    headSize: 15,
    curviness: 20,
    waveCount: 1.5,
    waveDirection: -1,
  },
  "DEFAULT": { // Green snake with yellow bands
    bodyWidth: 16,
    bodyColor: "#5eb344",
    stripes: [
      { color: "#fadd00", dashArray: "12 24", dashOffset: "0" }
    ],
    outlineColor: "#222222",
    headSize: 15,
    curviness: 20,
    waveCount: 2.5,
    waveDirection: 1,
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
  const dy = tailPos.y - headPos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // --- Seeded random (stable per snake) ---
  function seededRandom(seedStr: string) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = Math.imul(31, hash) + seedStr.charCodeAt(i) | 0;
    }
    const x = Math.sin(hash) * 10000;
    return x - Math.floor(x);
  }

  const rand1 = seededRandom(styleKey + "wave");
  const rand2 = seededRandom(styleKey + "dir");

  // Multi-curve sine wave logic
  const numPoints = Math.max(20, Math.floor(distance / 2));
  
  // Use strictly defined variables if present to safely avoid intersections
  const numWaves = style.waveCount ?? (Math.max(1.5, distance / 120) + rand1 * 1.5);
  const direction = style.waveDirection ?? (rand2 > 0.5 ? 1 : -1);
  const amplitude = style.curviness * direction;

  const perpX = -dy / distance;
  const perpY = dx / distance;

  let pathD = `M ${headPos.x} ${headPos.y}`;

  // Generate sine wave
  for (let i = 1; i <= numPoints; i++) {
    const t = i / numPoints;
    const taper = Math.sin(t * Math.PI); // Taper at ends to snap to cells

    const baseX = headPos.x + t * dx;
    const baseY = headPos.y + t * dy;

    const wave = Math.sin(t * numWaves * Math.PI * 2);
    const offset = amplitude * wave * taper;

    const px = baseX + perpX * offset;
    const py = baseY + perpY * offset;

    pathD += ` L ${px} ${py}`;
  }

  // Calculate face angle from the first tiny step to perfectly align head
  const t1 = 0.01;
  const taper1 = Math.sin(t1 * Math.PI);
  const wave1 = Math.sin(t1 * numWaves * Math.PI * 2);
  const offset1 = amplitude * wave1 * taper1;
  const px1 = headPos.x + t1 * dx + perpX * offset1;
  const py1 = headPos.y + t1 * dy + perpY * offset1;
  
  const vx = headPos.x - px1;
  const vy = headPos.y - py1;
  const angle = Math.atan2(vy, vx) * (180 / Math.PI) + 90;

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
