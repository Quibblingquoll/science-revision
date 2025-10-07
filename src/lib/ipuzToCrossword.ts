// src/lib/ipuzToCrossword.ts
type RCWord = { clue: string; answer: string; row: number; col: number };
export type RCData = { across: Record<string, RCWord>; down: Record<string, RCWord> };

type IpuzClue = { number: number | string; clue: string; answer: string };
type Ipuz = {
  grid: (string | number)[][];
  clues?: {
    across?: IpuzClue[];
    down?: IpuzClue[];
  };
};

export function ipuzToReactCrossword(ipuz: Ipuz): RCData {
  // Basic parse
  const grid = ipuz.grid || [];
  const rows = grid.length;
  const cols = rows ? grid[0].length : 0;

  // Build letter grid (string) and block map
  const isBlock = (cell: unknown) => cell === '#' || cell == null; // strict + nullish

  // Map clue number -> {answer, clue}; we’ll place them by scanning starts
  const acrossClues = new Map<number, { clue: string; answer: string }>();
  const downClues = new Map<number, { clue: string; answer: string }>();

  const acrossList = (ipuz.clues?.across ?? []) as IpuzClue[];
  const downList = (ipuz.clues?.down ?? []) as IpuzClue[];

  for (const entry of acrossList) {
    const num = Number(entry.number);
    acrossClues.set(num, {
      clue: entry.clue,
      answer: entry.answer.replace(/\s+/g, '').toUpperCase(),
    });
  }
  for (const entry of downList) {
    const num = Number(entry.number);
    downClues.set(num, {
      clue: entry.clue,
      answer: entry.answer.replace(/\s+/g, '').toUpperCase(),
    });
  }

  const across: Record<string, RCWord> = {};
  const down: Record<string, RCWord> = {};

  // Numbering may be provided in ipuz; if not, compute American-style numbering
  let autoNum = 1;
  const getNumberAt = (r: number, c: number) => {
    const cell = grid[r][c];
    if (typeof cell === 'number') return cell;
    return autoNum++; // fallback numbering
  };

  // Detect starts and place words
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (isBlock(grid[r][c])) continue;

      const startAcross =
        (c === 0 || isBlock(grid[r][c - 1])) && c + 1 < cols && !isBlock(grid[r][c + 1]);
      const startDown =
        (r === 0 || isBlock(grid[r - 1][c])) && r + 1 < rows && !isBlock(grid[r + 1][c]);

      if (!startAcross && !startDown) continue;

      const num = getNumberAt(r, c);

      if (startAcross) {
        if (acrossClues.has(num)) {
          const meta = acrossClues.get(num)!;
          across[String(num)] = { clue: meta.clue, answer: meta.answer, row: r, col: c };
        }
      }
      if (startDown) {
        if (downClues.has(num)) {
          const meta = downClues.get(num)!;
          down[String(num)] = { clue: meta.clue, answer: meta.answer, row: r, col: c };
        }
      }
    }
  }

  return { across, down };
}
