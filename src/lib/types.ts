export type Word = {
	id: number;
	word: string;
	length: number;
	displayText?: string;
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

	grid: {
		row: number;
		column: number;

		backwardProbability: number;
		diagonalProbability: number;
	};
};
