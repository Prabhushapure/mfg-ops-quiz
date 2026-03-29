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
];

// Ladders: bottom → top (landing on bottom triggers quiz)
export const LADDERS: SnakeOrLadder[] = [
  { from: 2, to: 10 },
  { from: 7, to: 18 },
  { from: 11, to: 26 },
  { from: 14, to: 27 },
  { from: 29, to: 35 },
];

// Industrial color palette for cells
const CELL_COLORS = [
  "#2d4a3e", // dark teal
  "#3d2f5c", // deep purple
  "#4a3728", // earth brown
  "#2c3e50", // midnight blue
  "#3e2723", // dark sienna
  "#1b5e20", // forest green
  "#4a148c", // deep violet
  "#bf360c", // deep orange-red
  "#006064", // dark cyan
  "#263238", // blue grey
  "#33691e", // olive green
  "#4e342e", // brown
  "#1a237e", // indigo
  "#880e4f", // dark pink
  "#004d40", // dark teal
  "#311b92", // deep purple
  "#e65100", // orange
  "#01579b", // light blue dark
  "#827717", // lime dark
  "#3e2723", // brown
  "#0d47a1", // blue
  "#1b5e20", // green
  "#f57f17", // amber
  "#4a148c", // purple
  "#006064", // cyan
  "#bf360c", // deep orange
  "#283593", // indigo
  "#2e7d32", // green
  "#ad1457", // pink
  "#00695c", // teal
  "#4527a0", // deep purple
  "#c62828", // red
  "#1565c0", // blue
  "#558b2f", // light green
  "#ff6f00", // amber
  "#6a1b9a", // purple
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
