import type { Word } from './types';

export interface Mode {
	grid: {
		column: number;
		row: number;
	};
	words: number;
	backwordProb: number;
	diagonalProb: number;
	type: MODES;
	title: string;
	preprocess?: (words: Word[]) => Word[];
}

export enum MODES {
	EASY = 1,
	NORMAL = 2,
	HARD = 3,
	IMPOSSIBLE = 4
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
		diagonalProb: 0.25,
		type: MODES.EASY,
		title: 'Mudah'
	},
	[MODES.NORMAL]: {
		grid: {
			column: 9,
			row: 11
		},
		words: 8,
		backwordProb: 0.5,
		diagonalProb: 0.5,
		type: MODES.NORMAL,
		title: 'Sederhana'
	},
	[MODES.HARD]: {
		grid: {
			column: 11,
			row: 13
		},
		words: 12,
		backwordProb: 0.75,
		diagonalProb: 0.75,
		type: MODES.HARD,
		title: 'Sukar'
	},
	[MODES.IMPOSSIBLE]: {
		grid: {
			column: 13,
			row: 15
		},
		words: 16,
		backwordProb: 0.9,
		diagonalProb: 0.75,
		type: MODES.IMPOSSIBLE,
		title: 'Mustahil',
		preprocess(words) {
			const word_list = words.map((word) => word.word);
			const pick_random = (str: string, amount: number) => {
				const rands: number[] = [];

				if (amount > str.length) return str.split('').map((_, i) => i);

				while (rands.length < amount) {
					const random_pos = Math.floor(Math.random() * str.length);
					if (rands.includes(random_pos)) continue;
					rands.push(random_pos);
				}

				return rands;
			};
			const MIN_CHARS = 3;
			const displayNames = word_list
				.map((word) =>
					pick_random(
						word,
						Math.floor(Math.random() * (word.length - 2 - MIN_CHARS + 1)) + MIN_CHARS
					)
				)
				.map((nums, i) => {
					let str = '';
					for (let _ = 0; _ < word_list[i].length; _++) {
						if (nums.includes(_)) {
							str += word_list[i].charAt(_);
						} else {
							str += '_';
						}
					}

					return str;
				});

			// assign displayNames to word_list;
			const new_words = words.map((word, i) => ({ ...word, displayText: displayNames[i] }));

			return new_words;
		}
	}
};
