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
	words: string[];
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
