import type { Coord, WordInGrid } from './types';
import { getDirection, getSteps } from './util';

export const EMPTY_CHAR = ' ';

const placeWord = (grid: string[][], word: string, start: Coord, end: Coord) => {
	const direction = getDirection(start.x, start.y, end.x, end.y);
	const steps = getSteps(start, end);

	for (let i = 0; i <= steps; i++) {
		const x = start.x + direction.x * i;
		const y = start.y + direction.y * i;
		const char = word[i];
		grid[y][x] = char;
	}

	return grid;
};

export const placeWords = (grid: string[][], words: WordInGrid[]) => {
	words.forEach((word) => {
		grid = placeWord(grid, word.value, word.start, word.end);
	});

	return grid;
};

export const createEmptyGrid = (rows: number, columns: number) => {
	let result: string[][] = [];

	result = Array(rows)
		.fill(null)
		.map(() => Array(columns).fill(EMPTY_CHAR));
	return result;
};

export const expandShrinkGrid = (grid: string[][], rows: number, columns: number) => {
	let result: string[][];

	result = grid;

	// expand / shrink given grid
	const currentRows = result.length;
	const currentCols = result[0].length;

	if (rows > currentRows) {
		// expand rows
		const totalRows = rows - currentRows;
		console.log('Expanding rows by: ', totalRows);
		for (let i = 0; i < totalRows; i++) {
			result.push(Array(currentCols).fill(EMPTY_CHAR));
		}
	} else if (rows < currentRows) {
		// shrink rows
		console.log('Shrinking rows by: ', currentRows - rows);

		result = result.slice(0, currentRows - (currentRows - rows));
	}

	if (columns > currentCols) {
		// expand all rows
		const totalCols = columns - currentCols;
		for (let i = 0; i < result.length; i++) {
			result[i] = [...result[i], ...Array(totalCols).fill(EMPTY_CHAR)];
		}
	} else if (columns < currentCols) {
		for (let i = 0; i < result.length; i++) {
			result[i] = result[i].slice(0, currentCols - (currentCols - columns));
		}
	}

	return result;
};
