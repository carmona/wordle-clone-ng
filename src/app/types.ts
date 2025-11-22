export interface Cell {
  letter: string | null;
  status?: 'correct' | 'present' | 'absent';
}

export interface Row {
  cells: Cell[];
  isFilled: boolean;
}

