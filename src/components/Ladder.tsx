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
          id={`${ladderId}-wood-grad`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#4a2e15" />
          <stop offset="20%" stopColor="#7a4623" />
          <stop offset="50%" stopColor="#a36233" />
          <stop offset="80%" stopColor="#7a4623" />
          <stop offset="100%" stopColor="#3d240e" />
        </linearGradient>

        <linearGradient
          id={`${ladderId}-rung-grad`}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#8c5128" />
          <stop offset="50%" stopColor="#ba723d" />
          <stop offset="100%" stopColor="#5c3619" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <line
        x1={leftRailStart.x + 3}
        y1={leftRailStart.y + 3}
        x2={leftRailEnd.x + 3}
        y2={leftRailEnd.y + 3}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1={rightRailStart.x + 3}
        y1={rightRailStart.y + 3}
        x2={rightRailEnd.x + 3}
        y2={rightRailEnd.y + 3}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Rails Base Wood */}
      <line
        x1={leftRailStart.x}
        y1={leftRailStart.y}
        x2={leftRailEnd.x}
        y2={leftRailEnd.y}
        stroke={`url(#${ladderId}-wood-grad)`}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1={rightRailStart.x}
        y1={rightRailStart.y}
        x2={rightRailEnd.x}
        y2={rightRailEnd.y}
        stroke={`url(#${ladderId}-wood-grad)`}
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Rail Wood Grain Texture */}
      <line
        x1={leftRailStart.x - 1}
        y1={leftRailStart.y}
        x2={leftRailEnd.x - 1}
        y2={leftRailEnd.y}
        stroke="#3d240e"
        strokeWidth="1"
        strokeDasharray="14 6 8 12 20 4"
        opacity="0.4"
      />
      <line
        x1={rightRailStart.x + 1}
        y1={rightRailStart.y}
        x2={rightRailEnd.x + 1}
        y2={rightRailEnd.y}
        stroke="#5c3619"
        strokeWidth="1"
        strokeDasharray="8 4 18 10 12 6"
        opacity="0.5"
      />

      {/* Rungs */}
      {rungs.map((rung, i) => (
        <g key={i}>
          <line
            x1={rung.x1 + 1}
            y1={rung.y1 + 1.5}
            x2={rung.x2 + 1}
            y2={rung.y2 + 1.5}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1={rung.x1}
            y1={rung.y1}
            x2={rung.x2}
            y2={rung.y2}
            stroke={`url(#${ladderId}-rung-grad)`}
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Rung Grain Texture */}
          <line
            x1={rung.x1}
            y1={rung.y1}
            x2={rung.x2}
            y2={rung.y2}
            stroke="#5c3619"
            strokeWidth="1"
            strokeDasharray="6 3 10 5"
            opacity="0.6"
          />
        </g>
      ))}

      {/* Rustic accents at joints */}
      {rungs.map((rung, i) => (
        <g key={`accent-${i}`}>
          <circle cx={rung.x1} cy={rung.y1} r="1.5" fill="#3d240e" />
          <circle cx={rung.x2} cy={rung.y2} r="1.5" fill="#3d240e" />
        </g>
      ))}
    </g>
  );
}
