import { CellPosition, SnakeOrLadder } from "@/types/game";

export const BOARD_SIZE = 6;
export const TOTAL_CELLS = 36;
export const CELL_SIZE = 90;
export const BOARD_PADDING = 10;
export const BOARD_PIXEL_SIZE = BOARD_SIZE * CELL_SIZE + BOARD_PADDING * 2;

// Snakes: head → tail (landing on head triggers quiz)
export const SNAKES: SnakeOrLadder[] = [
  { from: 25, to: 6 },
  { from: 34, to: 12 },
  { from: 22, to: 3 },
  { from: 16, to: 8 },
  { from: 31, to: 19 },
  { from: 20, to: 9 },
  { from: 33, to: 15 },
  { from: 28, to: 17 },
];

// Ladders: bottom → top (landing on bottom triggers quiz)
export const LADDERS: SnakeOrLadder[] = [
  { from: 2, to: 10 },
  { from: 7, to: 18 },
  { from: 11, to: 26 },
  { from: 14, to: 27 },
  { from: 29, to: 35 },
];

const THEME_COLORS = {
  LIME: "#a8cc1c",
  BLUE: "#009fe3",
  ORANGE: "#f39200",
  PURPLE: "#95288b",
  MAGENTA: "#e4007c",
  RED: "#e30613",
  YELLOW: "#ffcc00",
};

// Vibrant color palette matching the provided classic snake & ladders board graphic.
const CELL_COLORS = [
  THEME_COLORS.LIME,    THEME_COLORS.BLUE,    THEME_COLORS.ORANGE,  THEME_COLORS.PURPLE,  THEME_COLORS.MAGENTA, THEME_COLORS.RED,     // 1-6
  THEME_COLORS.PURPLE,  THEME_COLORS.LIME,    THEME_COLORS.MAGENTA, THEME_COLORS.RED,     THEME_COLORS.ORANGE,  THEME_COLORS.YELLOW,  // 7-12
  THEME_COLORS.MAGENTA, THEME_COLORS.PURPLE,  THEME_COLORS.BLUE,    THEME_COLORS.ORANGE,  THEME_COLORS.LIME,    THEME_COLORS.MAGENTA, // 13-18
  THEME_COLORS.BLUE,    THEME_COLORS.BLUE,    THEME_COLORS.YELLOW,  THEME_COLORS.PURPLE,  THEME_COLORS.YELLOW,  THEME_COLORS.LIME,    // 19-24
  THEME_COLORS.BLUE,    THEME_COLORS.RED,     THEME_COLORS.BLUE,    THEME_COLORS.PURPLE,  THEME_COLORS.RED,     THEME_COLORS.LIME,    // 25-30
  THEME_COLORS.PURPLE,  THEME_COLORS.RED,     THEME_COLORS.LIME,    THEME_COLORS.BLUE,    THEME_COLORS.YELLOW,  THEME_COLORS.MAGENTA  // 31-36
];

/**
 * Convert cell number (1-36) to grid row/col.
 * Boustrophedon: row 0 = bottom, left→right; row 1 = right→left; etc.
 */
export function cellToRowCol(cellNumber: number): { row: number; col: number } {
  const index = cellNumber - 1;
  const row = Math.floor(index / BOARD_SIZE);
  const colInRow = index % BOARD_SIZE;
  // Even rows go left→right, odd rows go right→left
  const col = row % 2 === 0 ? colInRow : BOARD_SIZE - 1 - colInRow;
  return { row, col };
}

/**
 * Get pixel position (center) for a cell on the SVG board.
 * Row 0 is at the bottom of the board visually.
 */
export function getCellPosition(cellNumber: number): CellPosition {
  const { row, col } = cellToRowCol(cellNumber);
  // Flip row so row 0 is at the bottom visually
  const visualRow = BOARD_SIZE - 1 - row;
  return {
    row,
    col,
    x: BOARD_PADDING + col * CELL_SIZE + CELL_SIZE / 2,
    y: BOARD_PADDING + visualRow * CELL_SIZE + CELL_SIZE / 2,
  };
}

/**
 * Get the top-left corner of a cell for drawing rectangles.
 */
export function getCellTopLeft(cellNumber: number): { x: number; y: number } {
  const { row, col } = cellToRowCol(cellNumber);
  const visualRow = BOARD_SIZE - 1 - row;
  return {
    x: BOARD_PADDING + col * CELL_SIZE,
    y: BOARD_PADDING + visualRow * CELL_SIZE,
  };
}

export function getCellColor(cellNumber: number): string {
  return CELL_COLORS[(cellNumber - 1) % CELL_COLORS.length];
}

export function getSnakeAt(cell: number): SnakeOrLadder | undefined {
  return SNAKES.find((s) => s.from === cell);
}

export function getLadderAt(cell: number): SnakeOrLadder | undefined {
  return LADDERS.find((l) => l.from === cell);
}
