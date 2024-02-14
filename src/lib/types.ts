export type Word = {
	value: string;
	display: string;
};

export type Cells = {
	start: number[];
	end: number[];
};

export type Highlight = {
	start: number[];
	end: number[];
	rotation: number;
	color: string;
};

export type Found = {
	word: Word;
	coord: number[][];
	color: string;
};

export type Theme = 'light' | 'dark' | 'system';

export type Coord = {
	x: number;
	y: number;
};

export type Solved = {
	word: WordInGrid;
	highlight: HighlightData;
};

export type Game = {
	title: string;
	words: WordInGrid[];
	timeStartedAt?: number;
	timeFinishedAt?: number;

	grid: GridOptions;

	backwardProbability: number;

	functions?: string[];
};

export type GridOptions = {
	rows: number;
	columns: number;

	grid: string[][];
	solved: string[][];
};

export type DisplayWordFunction = (word: Word, solvedWords: Solved[]) => string;

export type OnCellPress = (
	cell: {
		coord: Coord;
	},
	grid: {
		grid: string[][];
	}
) => void;

export type OnCellRelease = (
	cell: {
		coord: Coord;
		valid: boolean;
	},
	grid: {
		grid: string[][];
		updateGrid: (grid: string[][]) => void;
	}
) => void;

export type ActivateCells = (coords: Coord[]) => void;
export type DeactivateCells = (coords: Coord[]) => void;
export type ResetCells = () => void;

export type HighlightData = {
	id: number;
	angle: number;
	start: Coord;
	end: Coord;
	width?: number;
	color: string;
	outline?: string;
};

export type HighlightUpdate = (data: Partial<HighlightData>) => void;
export type CalcHighlightWidth = (start: Coord, end: Coord) => number;

export type OnCellMove = (
	start: Coord,
	current: Coord | null,
	highlight: {
		highlight: HighlightData;
		updateCurrentHighlight: HighlightUpdate;
		calcHighlightWidth: CalcHighlightWidth;
	},
	options: {
		highlights: HighlightData[];
		addHighlight: (data: Omit<HighlightData, 'id'>) => HighlightData;
		updateHighlight: (id: number, data: Partial<Omit<HighlightData, 'id'>>) => void;
		removeHighlight: (id: number) => void;
	}
) => void;

export type OnSuccessPlacement = (word: string, start: Coord, end: Coord) => void;

export type WordInGrid = Word & {
	start: Coord;
	end: Coord;
};

export type AddHighlight = (data: Omit<HighlightData, 'id'>) => HighlightData;
export type UpdateHighlight = (id: number, data: Partial<Omit<HighlightData, 'id'>>) => void;
export type RemoveHighlight = (id: number) => void;
