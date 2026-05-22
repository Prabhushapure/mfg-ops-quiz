import {
  BOARD_SIZE,
  BOARD_PADDING,
  BOARD_PIXEL_SIZE,
  CELL_SIZE,
  SNAKES,
  LADDERS,
  cellToRowCol,
  getCellColor,
} from "@/lib/boardConfig";
import Snake from "./Snake";
import Ladder from "./Ladder";
import PlayerToken from "./PlayerToken";

interface GameBoardProps {
  playerPosition: number;
}

export default function GameBoard({ playerPosition }: GameBoardProps) {
  const cells = [];
  const cellTexts = [];

  for (let cellNum = 1; cellNum <= BOARD_SIZE * BOARD_SIZE; cellNum++) {
    const { row, col } = cellToRowCol(cellNum);
    // Flip row so row 0 (cells 1-6) is at bottom visually
    const visualRow = BOARD_SIZE - 1 - row;
    const x = BOARD_PADDING + col * CELL_SIZE;
    const y = BOARD_PADDING + visualRow * CELL_SIZE;

    const isStart = cellNum === 1;
    const isFinish = cellNum === 36;

    cells.push(
      <g key={`bg-${cellNum}`}>
        {/* Cell background */}
        <rect
          x={x}
          y={y}
          width={CELL_SIZE}
          height={CELL_SIZE}
          fill={getCellColor(cellNum)}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          rx="4"
          ry="4"
        />
        {/* Inner shadow */}
        <rect
          x={x + 1}
          y={y + 1}
          width={CELL_SIZE - 2}
          height={CELL_SIZE - 2}
          fill="none"
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="1"
          rx="3"
          ry="3"
        />
      </g>
    );

    cellTexts.push(
      <g key={`text-${cellNum}`}>
        {/* Cell number */}
        <text
          x={x + 8}
          y={y + 18}
          fill="#ffffff"
          fontSize="14"
          fontWeight="800"
          fontFamily="var(--font-sans)"
          stroke="#000000"
          strokeWidth="0.5"
          colorInterpolationFilters="sRGB"
        >
          {cellNum}
        </text>
        {/* Start / Finish labels */}
        {isStart && (
          <g>
            <text
              x={x + CELL_SIZE / 2}
              y={y + CELL_SIZE - 22}
              fill="#ffffff"
              fontSize="12"
              fontWeight="800"
              textAnchor="middle"
              fontFamily="var(--font-sans)"
            >
              START
            </text>
            <text
              x={x + CELL_SIZE / 2}
              y={y + CELL_SIZE - 8}
              fill="#ffffff"
              fontSize="16"
              fontWeight="900"
              textAnchor="middle"
              fontFamily="var(--font-sans)"
            >
              →
            </text>
          </g>
        )}
        {isFinish && (
          <g>
            <text
              x={x + CELL_SIZE / 2}
              y={y + CELL_SIZE - 22}
              fill="#ffffff"
              fontSize="12"
              fontWeight="800"
              textAnchor="middle"
              fontFamily="var(--font-sans)"
            >
              FINISH
            </text>
            <text
              x={x + CELL_SIZE / 2}
              y={y + CELL_SIZE - 8}
              fill="#ffffff"
              fontSize="16"
              fontWeight="900"
              textAnchor="middle"
              fontFamily="var(--font-sans)"
            >
              ←
            </text>
          </g>
        )}
      </g>
    );
  }

  return (
    <div className="w-full max-w-[720px] mx-auto">
      <svg
        viewBox={`0 0 ${BOARD_PIXEL_SIZE} ${BOARD_PIXEL_SIZE}`}
        className="w-full h-auto rounded-xl border-2 border-navy-700 shadow-2xl"
        style={{ background: "#0f1628" }}
      >
        {/* Board background */}
        <rect
          x="0"
          y="0"
          width={BOARD_PIXEL_SIZE}
          height={BOARD_PIXEL_SIZE}
          fill="#0f1628"
          rx="8"
          ry="8"
        />

        {/* Grid cells */}
        {cells}

        {/* Ladders (drawn below snakes) */}
        {LADDERS.map((ladder) => (
          <Ladder key={`ladder-${ladder.from}`} ladder={ladder} />
        ))}

        {/* Snakes */}
        {SNAKES.map((snake) => (
          <Snake key={`snake-${snake.from}`} snake={snake} />
        ))}

        {/* Cell Texts on top */}
        {cellTexts}

        {/* Player */}
        <PlayerToken position={playerPosition} />
      </svg>
    </div>
  );
}
