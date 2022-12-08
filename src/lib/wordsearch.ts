import { shuffle } from './util';

export type WordSearch = {
	grid: string[][];
	solved: string[][];
	unplaced: string[];
	words: string[];
	config: WordSearchOption;
};

export type WordSearchOption = {
	backwards: number;
	totalWordsInGrid: number;
	letters: string;
};

export type DirectionInfo = {
	maxX: number; // max starting pos at x-axis
	maxY: number; // max starting pos at y-axis
	minX: number; // min starting pos at x-axis
	minY: number; // min starting pos at y-axis
	dx: number; // where should next letter be at x-axis
	dy: number; // where should next letter be at y-axis
};

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const MAX_ATTEMPTS = 30;

export const wordsearch = (
	word_list: string[],
	column: number,
	row: number,
	config: WordSearchOption = {
		backwards: 0.5,
		totalWordsInGrid: 10,
		letters: LETTERS
	}
): WordSearch => {
	const usedWords: string[] = [];
	const unplaced: string[] = [];

	// populate the grid with empty arrays
	const grid: string[][] = new Array(row);
	for (let i = 0; i < grid.length; i++) {
		grid[i] = new Array(column);
	}

	const calcWords = [...word_list];
	shuffle(calcWords);

	for (let i = 0; i < calcWords.length; i++) {
		let word = calcWords[i];
		const originalWord = calcWords[i];

		if (Math.random() < config.backwards) {
			word = word.split('').reverse().join();
		}

		let attempts = 0;
		while (attempts < MAX_ATTEMPTS) {
			// determine the direction (up-right, right, down-right, down)
			const direction = Math.floor(Math.random() * 4);
			const info = directionInfo(word, direction, column, row);

			// word too long, bail out
			if (info.maxX < 0 || info.maxY < 0 || info.maxX < info.minX || info.maxY < info.minY) {
				console.log('balls');
				unplaced.push(originalWord);
				break;
			}

			// random valid starting point
			const ox = Math.round(Math.random() * (info.maxX - info.minX) + info.minX);
			const oy = Math.round(Math.random() * (info.maxY - info.minY) + info.minY);
			let x = ox;
			let y = oy;

			// check to make sure the are no collisions
			let placeable = true;
			let count = 0;

			for (let l = 0; l < word.length; l++) {
				const charInGrid = grid[y][x];

				if (charInGrid) {
					// check if there is a character in the grid

					if (charInGrid !== word.charAt(l)) {
						placeable = false;
						break;
					} else {
						// same letter! count it
						count++;
					}
				}

				// keep trying for the next letter
				y += info.dy;
				x += info.dx;
			}

			if (!placeable || count >= word.length) {
				// invalid place point
				attempts++;
				continue;
			}

			// the word was placeable if we make it here!
			// reset x and y and place it
			x = ox;
			y = oy;

			for (let l = 0; l < word.length; l++) {
				grid[y][x] = word.charAt(l);

				y += info.dy;
				x += info.dx;
			}

			// console.log(originalWord);
			usedWords.push(originalWord);
			// console.log(usedWords);
			break;
		} // end placement loop

		if (attempts >= MAX_ATTEMPTS) {
			console.log('hehe');
			unplaced.push(originalWord);
		}

		if (usedWords.length >= config.totalWordsInGrid) {
			console.log('woi');
			console.log(usedWords);
			break;
		}
	}

	const solved = JSON.parse(JSON.stringify(grid));

	// put in filler characters
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			if (!grid[i][j]) {
				solved[i][j] = ' ';
				grid[i][j] = config.letters.charAt(Math.floor(Math.random() * config.letters.length));
			}
		}
	}

	// return vals
	return {
		grid: grid,
		solved: solved,
		unplaced: unplaced,
		words: usedWords,
		config
	};
};

export const directionInfo = (
	word: string,
	direction: number,
	width: number,
	height: number
): DirectionInfo => {
	let minX = 0;
	let minY = 0;

	let maxX = width - 1;
	let maxY = height - 1;

	let dx = 0;
	let dy = 0;

	switch (direction) {
		case 0: {
			// up-right
			maxX = height - 1;
			minY = word.length - 1;
			dy = -1;

			maxX = width - word.length;
			minX = 0;
			dx = 0;

			break;
		}

		case 1: {
			// right
			maxX = width - word.length;
			minX = 0;
			dx = 1;

			break;
		}
		case 2: {
			// down-right
			minY = 0;
			maxY = height - word.length;
			dy = 1;

			minX = 0;
			maxX = width - word.length;
			dx = 1;

			break;
		}
		case 3: {
			//down
			minY = 0;
			maxY = height - word.length;
			dy = 1;
			break;
		}
		default: // notREACHED
			break;
	}

	return {
		minX,
		minY,
		maxX,
		maxY,
		dx,
		dy
	};
};
