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
	word: string;
	coords: Coord[];
	angle: number;
	color?: string;
};

export type Game = {
	title: string;
	words: Word[];
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

export type OnCellPressFunction = (
	cell: {
		coord: Coord;
	},
	grid: {
		grid: string[][];
	}
) => void;

export type OnCellReleaseFunction = (
	cell: {
		coord: Coord;
	},
	grid: {
		grid: string[][];
		updateGrid: (grid: string[][]) => void;
	}
) => void;

export type HighlightData = {
	id: number;
	angle: number;
	start: Coord;
	end: Coord;
	width: number;
	color: string;
};

export type HighlightUpdate = (data: Partial<HighlightData>) => void;
export type CalcHighlightWidth = (start: Coord, end: Coord) => number;

export type OnCellMoveFunction = (
	start: Coord,
	current: Coord | null,
	highlight: HighlightData & {
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
