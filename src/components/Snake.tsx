"use client";

import { getCellPosition } from "@/lib/boardConfig";
import { SnakeOrLadder } from "@/types/game";

interface SnakeStyle {
  bodyWidth: number;
  colors: [string, string, string]; // gradient: top, mid, bottom
  headColor: string;
  eyeColor: string;
  patternType: "scales" | "diamonds" | "stripes" | "zigzag" | "dots" | "chevron" | "none" | "crosshatch";
  curviness: number; // how far the S-curve deviates
  headSize: number;
}

// Each snake gets a unique look
const SNAKE_STYLES: Record<string, SnakeStyle> = {
  "25-6": {
    bodyWidth: 14,
    colors: ["#dc2626", "#991b1b", "#7f1d1d"],
    headColor: "#dc2626",
    eyeColor: "#fbbf24",
    patternType: "scales",
    curviness: 35,
    headSize: 12,
  },
  "34-12": {
    bodyWidth: 8,
    colors: ["#7c3aed", "#5b21b6", "#4c1d95"],
    headColor: "#7c3aed",
    eyeColor: "#a5f3fc",
    patternType: "stripes",
    curviness: 20,
    headSize: 8,
  },
  "22-3": {
    bodyWidth: 16,
    colors: ["#059669", "#047857", "#064e3b"],
    headColor: "#059669",
    eyeColor: "#fde68a",
    patternType: "diamonds",
    curviness: 40,
    headSize: 14,
  },
  "16-8": {
    bodyWidth: 10,
    colors: ["#ea580c", "#c2410c", "#9a3412"],
    headColor: "#ea580c",
    eyeColor: "#bef264",
    patternType: "zigzag",
    curviness: 25,
    headSize: 9,
  },
  "31-19": {
    bodyWidth: 12,
    colors: ["#be123c", "#9f1239", "#881337"],
    headColor: "#be123c",
    eyeColor: "#fcd34d",
    patternType: "dots",
    curviness: 30,
    headSize: 11,
  },
  "20-9": {
    bodyWidth: 18,
    colors: ["#854d0e", "#713f12", "#422006"],
    headColor: "#a16207",
    eyeColor: "#f87171",
    patternType: "chevron",
    curviness: 45,
    headSize: 15,
  },
  "33-15": {
    bodyWidth: 7,
    colors: ["#0891b2", "#0e7490", "#155e75"],
    headColor: "#0891b2",
    eyeColor: "#fbbf24",
    patternType: "none",
    curviness: 18,
    headSize: 7,
  },
  "28-17": {
    bodyWidth: 11,
    colors: ["#9333ea", "#7e22ce", "#581c87"],
    headColor: "#9333ea",
    eyeColor: "#34d399",
    patternType: "crosshatch",
    curviness: 28,
    headSize: 10,
  },
};

const DEFAULT_STYLE: SnakeStyle = {
  bodyWidth: 12,
  colors: ["#dc2626", "#991b1b", "#7f1d1d"],
  headColor: "#dc2626",
  eyeColor: "#fbbf24",
  patternType: "scales",
  curviness: 30,
  headSize: 11,
};

interface SnakeProps {
  snake: SnakeOrLadder;
}

function renderPattern(patternId: string, type: SnakeStyle["patternType"]) {
  switch (type) {
    case "scales":
      return (
        <pattern id={patternId} patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(0,0,0,0.18)" strokeWidth="3" />
        </pattern>
      );
    case "diamonds":
      return (
        <pattern id={patternId} patternUnits="userSpaceOnUse" width="10" height="10">
          <polygon points="5,0 10,5 5,10 0,5" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        </pattern>
      );
    case "stripes":
      return (
        <pattern id={patternId} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(90)">
          <line x1="0" y1="3" x2="6" y2="3" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        </pattern>
      );
    case "zigzag":
      return (
        <pattern id={patternId} patternUnits="userSpaceOnUse" width="12" height="6">
          <polyline points="0,6 3,0 6,6 9,0 12,6" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
        </pattern>
      );
    case "dots":
      return (
        <pattern id={patternId} patternUnits="userSpaceOnUse" width="8" height="8">
          <circle cx="4" cy="4" r="1.5" fill="rgba(255,255,255,0.15)" />
        </pattern>
      );
    case "chevron":
      return (
        <pattern id={patternId} patternUnits="userSpaceOnUse" width="10" height="8">
          <polyline points="0,8 5,0 10,8" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
        </pattern>
      );
    case "crosshatch":
      return (
        <pattern id={patternId} patternUnits="userSpaceOnUse" width="8" height="8">
          <line x1="0" y1="0" x2="8" y2="8" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="8" y1="0" x2="0" y2="8" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        </pattern>
      );
    case "none":
      return null;
  }
}

export default function Snake({ snake }: SnakeProps) {
  const headPos = getCellPosition(snake.from);
  const tailPos = getCellPosition(snake.to);

  const styleKey = `${snake.from}-${snake.to}`;
  const style = SNAKE_STYLES[styleKey] || DEFAULT_STYLE;

  const dx = tailPos.x - headPos.x;
  const midY = (headPos.y + tailPos.y) / 2;

  // S-curve with per-snake curviness
  const cp1x = headPos.x + dx * 0.3 + style.curviness;
  const cp1y = headPos.y + (midY - headPos.y) * 0.5;
  const cp2x = headPos.x + dx * 0.7 - style.curviness;
  const cp2y = midY + (tailPos.y - midY) * 0.5;

  const pathD = `M ${headPos.x} ${headPos.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${tailPos.x} ${tailPos.y}`;

  const snakeId = `snake-${styleKey}`;
  const gradientId = `grad-${snakeId}`;
  const patternId = `pattern-${snakeId}`;

  const hs = style.headSize;
  const hw = hs * 0.7;

  return (
    <g className="pointer-events-none">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={style.colors[0]} />
          <stop offset="50%" stopColor={style.colors[1]} />
          <stop offset="100%" stopColor={style.colors[2]} />
        </linearGradient>
        {renderPattern(patternId, style.patternType)}
      </defs>

      {/* Shadow */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth={style.bodyWidth + 3}
        strokeLinecap="round"
        transform="translate(2, 2)"
      />

      {/* Body */}
      <path
        d={pathD}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={style.bodyWidth}
        strokeLinecap="round"
      />

      {/* Pattern overlay */}
      {style.patternType !== "none" && (
        <path
          d={pathD}
          fill="none"
          stroke={`url(#${patternId})`}
          strokeWidth={style.bodyWidth}
          strokeLinecap="round"
        />
      )}

      {/* Body highlight (belly shine) */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={Math.max(2, style.bodyWidth * 0.3)}
        strokeLinecap="round"
      />

      {/* Head */}
      <g transform={`translate(${headPos.x}, ${headPos.y})`}>
        {/* Head shape — wider triangle */}
        <polygon
          points={`0,${-hs} ${hw},${-hs * 0.15} 0,${hs * 0.5} ${-hw},${-hs * 0.15}`}
          fill={style.headColor}
          stroke={style.colors[2]}
          strokeWidth="1"
        />
        {/* Eyes */}
        <circle cx={-hw * 0.4} cy={-hs * 0.35} r={hs * 0.13} fill={style.eyeColor} />
        <circle cx={hw * 0.4} cy={-hs * 0.35} r={hs * 0.13} fill={style.eyeColor} />
        <circle cx={-hw * 0.4} cy={-hs * 0.35} r={hs * 0.06} fill="#000" />
        <circle cx={hw * 0.4} cy={-hs * 0.35} r={hs * 0.06} fill="#000" />
        {/* Tongue */}
        <path
          d={`M 0 ${hs * 0.35} L ${-hs * 0.25} ${hs * 0.85} M 0 ${hs * 0.35} L ${hs * 0.25} ${hs * 0.85}`}
          stroke={style.headColor}
          strokeWidth="1"
          fill="none"
        />
      </g>
    </g>
  );
}
