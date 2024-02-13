import type { Coord, WordInGrid } from './types';
import { getDirection, getSteps } from './util';

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
