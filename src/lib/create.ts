import type { Coord, WordInGrid } from './types';
import { getDirection, getSteps, line_intersect, parallelLineOverlap } from './util';

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

export const isValidPlacement = (
	coords: { start: Coord; end: Coord },
	word: string,
	grid: string[][],
	allowOverflow = false
) => {
	const { start, end } = coords;

	const distance = getSteps(start, end) + 1;

	const direction = getDirection(start.x, start.y, end.x, end.y);

	for (let i = 0; i < distance; i++) {
		const x = start.x + direction.x * i;
		const y = start.y + direction.y * i;

		const char = word[i];

		if (char === undefined && !allowOverflow) return false;
		if (char === undefined && allowOverflow) return true;

		const charInCell = grid[y][x];

		// skip if cell is considered 'empty'
		if (charInCell === EMPTY_CHAR) continue;

		if (charInCell !== char) return false;
	}
	return true;
};

export const fillEmptyCell = (
	grid: string[][],
	CHARACTERS: string | string[] = 'abcdefghijklmnopqrstuvwxyz'
) => {
	const filled = grid.map((row) =>
		row.map((cell) =>
			cell === EMPTY_CHAR ? CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)] : cell
		)
	);

	return filled;
};

// get maximum valid length of word in grid and return the last length
// before clashing with another character in grid
export const getMaxValidLength = (
	word: string,
	start: Coord,
	direction: ReturnType<typeof getDirection>,
	grid: string[][]
): number => {
	// subtract 1 to count for 0 based grid system
	const length = word.length - 1;

	const end: Coord = {
		x: start.x + direction.x * length,
		y: start.y + direction.y * length
	};

	const steps = getSteps(start, end);

	let count = 0;

	for (let i = 0; i <= steps; i++) {
		const x = start.x + direction.x * i;
		const y = start.y + direction.y * i;

		if (y >= grid.length || y < 0 || x > grid[0].length || x < 0) break;

		const char = word[i];
		const cell = grid[y][x];

		if (cell !== char && cell !== EMPTY_CHAR) break;
		count++;
	}

	return count;
};

export const clearCells = (start: Coord, end: Coord, grid: string[][], excepts?: Coord[]) => {
	const steps = getSteps(start, end);
	const direction = getDirection(start.x, start.y, end.x, end.y);
	for (let i = 0; i <= steps; i++) {
		const x = start.x + direction.x * i;
		const y = start.y + direction.y * i;

		if (excepts !== undefined && excepts.findIndex((i) => i.x === x && i.y === y) >= 0) continue;

		grid[y][x] = EMPTY_CHAR;
	}

	return grid;
};

export const getIntersects = (start: Coord, end: Coord, items: WordInGrid[]) => {
	const intersects: { item: WordInGrid; coord: Coord[] }[] = [];

	for (let i = 0; i < items.length; i++) {
		const item = items[i];

		const parallelOverlaps = parallelLineOverlap(
			{
				start,
				end
			},
			{
				start: item.start,
				end: item.end
			}
		);

		if (parallelOverlaps) {
			intersects.push({
				item: item,
				coord: parallelOverlaps
			});
		}

		const intersect = line_intersect(
			start.x,
			start.y,
			end.x,
			end.y,
			item.start.x,
			item.start.y,
			item.end.x,
			item.end.y
		);

		if (!intersect) {
			continue;
		}

		intersects.push({
			item: item,
			coord: [intersect]
		});
	}
	return intersects;
};
