/*
original by Dave Eddy

*/

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const WORD_RE = /^[a-z]+$/;
const MAXATTEMPTS = 20;

export type WordSearch = {
	grid: string[][];
	solved: string[][];
	unplaced: string[];
	words: string[];
};
export const wordsearch = (words: string[], width = 20, height = 20): WordSearch => {
	const opts = {
		backwards: 0.5,
		letters: LETTERS
	};

	// filter out any non-words
	const oriWords = [...words];
	words = words.filter((word) => WORD_RE.test(word));

	// sort words by length in descending order(biggest first)
	words.sort((word1, word2) => (word1.length < word2.length ? -1 : 1));

	// populate the grid with empty arrays
	const grid: string[][] = new Array(height);
	for (let i = 0; i < grid.length; i++) {
		grid[i] = new Array(width);
	}

	// any invalid/unfit words stored here
	const unplaced: string[] = [];

	// loop the words
	for (let i = 0; i < words.length; i++) {
		let word = words[i];
		const originalWord = words[i];

		// reverse the word if needed
		if (Math.random() < opts.backwards) {
			word = word.split('').reverse().join('');
		}

		let attempts = 0;
		while (attempts < MAXATTEMPTS) {
			// determine the direction (up-right, right, down-right, down)
			const direction = Math.floor(Math.random() * 4);
			const info = directionInfo(word, direction, width, height);

			// word too long, bail out
			if (info.maxX < 0 || info.maxY < 0 || info.maxX < info.minX || info.maxY < info.minY) {
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
			break;
		} // end placement loopt

		if (attempts >= 20) {
			unplaced.push(originalWord);
		}
	} // end word loop

	const solved = JSON.parse(JSON.stringify(grid));

	// put in filler characters
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			if (!grid[i][j]) {
				solved[i][j] = ' ';
				grid[i][j] = opts.letters.charAt(Math.floor(Math.random() * opts.letters.length));
			}
		}
	}

	// return vals
	return {
		grid: grid,
		solved: solved,
		unplaced: unplaced,
		words: oriWords
	};
};

export type DirectionInfo = {
	maxX: number; // max starting pos at x-axis
	maxY: number; // max starting pos at y-axis
	minX: number; // min starting pos at x-axis
	minY: number; // min starting pos at y-axis
	dx: number; // where should next letter be at x-axis
	dy: number; // where should next letter be at y-axis
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

// // test
// const search = wordsearch(['hi', 'hello'], 20, 20);

// console.log(search);
