// src/types/react-crossword.d.ts
import * as React from 'react';

export type CrosswordWord = {
  clue: string;
  answer: string; // UPPERCASE, no spaces
  row: number; // 0-indexed
  col: number; // 0-indexed
};

export type CrosswordData = {
  across: Record<string, CrosswordWord>;
  down: Record<string, CrosswordWord>;
};

export interface CrosswordProps {
  data: CrosswordData;
  onCellChange?: (coord: [number, number], char: string) => void;
  onCrosswordCorrect?: (isCorrect: boolean) => void;
}

declare module '@jaredreisinger/react-crossword' {
  const Crossword: React.ComponentType<CrosswordProps>;
  export default Crossword;
}
