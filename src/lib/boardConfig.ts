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

// Muted industrial color palette — subdued so snakes/ladders stand out
const CELL_COLORS = [
  "#1e2d3d", // slate blue
  "#2a2438", // muted plum
  "#2d2a26", // charcoal brown
  "#1f2b38", // steel blue
  "#2b2226", // dark cocoa
  "#1e2e28", // forest shadow
  "#252135", // twilight purple
  "#2f2420", // umber
  "#1c2e30", // deep teal
  "#1e242a", // gunmetal
  "#252e1e", // olive shadow
  "#2a2524", // warm charcoal
  "#1c2040", // navy
  "#2d1e2a", // plum shadow
  "#1c2a28", // pine
  "#221c34", // indigo shadow
  "#302418", // bronze shadow
  "#1a2838", // steel
  "#2a2a1c", // khaki shadow
  "#2b2220", // mocha
  "#1c2640", // denim
  "#1e2e22", // sage dark
  "#302a18", // brass shadow
  "#261e38", // violet shadow
  "#1c2c2e", // petrol
  "#2e2218", // sienna shadow
  "#1e2238", // cobalt shadow
  "#222e24", // moss
  "#2a1e28", // berry shadow
  "#1e2c28", // jade dark
  "#241e34", // grape shadow
  "#2c1e1e", // rust shadow
  "#1c2636", // slate
  "#262e1e", // olive
  "#2e2818", // amber shadow
  "#241c30", // heather
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
