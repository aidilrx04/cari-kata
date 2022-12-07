export type Mode = {
	grid: {
		column: number;
		row: number;
	};
	words: number;
	backwordProb: number;
	diagonalProb: number;
};

export enum MODES {
	EASY = 1,
	NORMAL = 2,
	HARD = 3
}

export const MODE_TYPES: {
	[key: number]: Mode;
} = {
	[MODES.EASY]: {
		grid: {
			column: 7,
			row: 9
		},
		words: 6,
		backwordProb: 0.25,
		diagonalProb: 0.25
	},
	[MODES.NORMAL]: {
		grid: {
			column: 9,
			row: 11
		},
		words: 8,
		backwordProb: 0.5,
		diagonalProb: 0.5
	},
	[MODES.HARD]: {
		grid: {
			column: 11,
			row: 13
		},
		words: 12,
		backwordProb: 0.75,
		diagonalProb: 0.75
	}
};
