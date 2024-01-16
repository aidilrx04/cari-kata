<script lang="ts">
	import { currentColor, updateCurrentColor } from '$lib/colors';
	import type {
		Coord,
		GridOptions,
		HighlightData,
		OnCellMove,
		OnCellPress,
		OnCellRelease,
		OnSuccessPlacement,
		WordInGrid
	} from '$lib/types';
	import {
		getDirection,
		getSteps,
		parallelLineOverlap,
		line_intersect,
		validateAngle,
		isCoordOnLine
	} from '$lib/util';
	import Grid from '../game/Grid.svelte';
	import rgba from 'color-rgba';

	export let rows: number;
	export let columns: number;
	export let selected: string = '';

	$: console.log(selected);

	export let onSuccessPlacement: OnSuccessPlacement = () => {};

	let previousRows: number = rows;
	let previousColumns: number = columns;

	const EMPTY_CHAR = ' ';
	export let solved: string[][] = [];
	$: solved = solved.length === 0 ? createEmptyGrid(rows, columns) : solved;

	$: if (
		(rows !== previousRows || columns !== previousColumns) &&
		rows !== null &&
		columns !== null
	) {
		console.log('expanding/shrinking grid');
		solved = expandShrinkGrid(solved, rows, columns);
		previousRows = rows;
		previousColumns = columns;
	}

	export let grid: string[][] = [];
	$: grid = fillEmptyCell(solved);

	// store previous grid state for redo/undo word placement
	let previousSolved: string[][];

	let startCoord: Coord;
	let endCoord: Coord;

	let gridOptions: GridOptions;
	$: gridOptions = {
		rows: rows,
		columns: columns,
		grid: solved,
		solved: solved
	};

	// current angle
	let angle: number;

	let selectedHighlight: HighlightData | null;
	let updateHighlight: (id: number, data: Partial<Omit<HighlightData, 'id'>>) => void;
	let removeHighlight: (id: number) => void;

	export let placedWords: WordInGrid[];
	let wordAndHighlight: { word: string; highlight: HighlightData }[] = [];

	let intersections: { [id: number]: Coord } = {};
	let wordIntersects: { [word: string]: number[] } = {};

	$: if (placedWords.length !== wordAndHighlight.length) {
		const words = placedWords.map((i) => i.value);
		const removed = wordAndHighlight.filter((i) => !words.includes(i.word));
		wordAndHighlight = wordAndHighlight.filter((i) => words.includes(i.word));
		removed.forEach(({ word, highlight }) => {
			// find intersections of word
			const intersects = wordIntersects[word] ?? [];
			const coords = intersects
				.map((i) => intersections[i])
				// remove deleted intersections
				.filter((i) => i !== undefined);

			// clear word from grid
			solved = clearCells(highlight.start, highlight.end, solved, coords);

			// remove connected intersection
			intersects.forEach((intersect) => {
				delete intersections[intersect];
			});
			intersections = { ...intersections };

			removeHighlight(highlight.id);
		});
	}

	let hasSelectedPlaced: boolean = false;
	let activeHighlight: (typeof wordAndHighlight)[0] | undefined;

	$: if (selected) {
		// check if word is placed
		hasSelectedPlaced = placedWords.findIndex((i) => i.value === selected) >= 0;
		if (activeHighlight) {
			updateHighlight(activeHighlight.highlight.id, { outline: 'none' });
			activeHighlight = undefined;
		}
	}

	$: if (hasSelectedPlaced) {
		// highlight selected highlight
		// console.log(wordAndHighlight);
		const highlight = wordAndHighlight.find((i) => i.word === selected);
		if (highlight) {
			activeHighlight = highlight;
			let colors = rgba(highlight.highlight.color);
			colors[3] = 0.3;
			updateHighlight(highlight.highlight.id, {
				outline: `8px solid rgba(${colors})`
			});
		}
	}

	let placedCoords: Coord[] = [];
	$: if (placedWords) {
		const coords = placedWords.map((i) => getRangeCoords(i.start, i.end)).flat();

		const changed = placedCoords.filter(
			(i) => coords.findIndex((j) => j.x === i.x && j.y === i.y) < 0
		);

		placedCoords = coords;
		deactivateCells(changed);
		activateCells(placedCoords);
	}

	function expandShrinkGrid(grid: string[][], rows: number, columns: number) {
		let result: string[][];

		result = grid;

		// expand / shrink given grid
		let currentRows = result.length;
		let currentCols = result[0].length;

		if (rows > currentRows) {
			// expand rows
			let totalRows = rows - currentRows;
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
	}

	function createEmptyGrid(rows: number, columns: number) {
		let result: string[][] = [];

		result = Array(rows)
			.fill(null)
			.map(() => Array(columns).fill(EMPTY_CHAR));
		return result;
	}

	const handleCellPress: OnCellPress = (cell, grid) => {
		if (selected.length < 1) {
			// find cell to look for any placedword
			const word = getPlacedWord(cell.coord, placedWords);
			if (word) {
				selected = word.value;
				hasSelectedPlaced = true;
			}
			return;
		}

		if (hasSelectedPlaced) return;

		// save grid state
		previousSolved = [...grid.grid.map((i) => i.slice())];
		startCoord = cell.coord;
	};

	const handleCellRelease: OnCellRelease = (cell, currentGrid) => {
		if (selected.length < 1) return;

		if (hasSelectedPlaced) return;

		if (!cell.valid) {
			console.log('Invalid release target');
			restoreSolved();
			if (selectedHighlight !== null) {
				removeHighlight(selectedHighlight.id);
				selectedHighlight = null;
			}
			return;
		}

		endCoord = cell.coord;

		let validPlacement = isValidPlacement(
			{ start: startCoord, end: endCoord },
			selected,
			currentGrid.grid,
			true
		);

		const steps = getSteps(startCoord, endCoord);

		if (!validPlacement || selected.length > steps + 1) {
			console.log('wordlength / invalid angle!');
			restoreSolved();
			if (selectedHighlight !== null) {
				removeHighlight(selectedHighlight.id);
				selectedHighlight = null;
			}
			return;
		}

		// placeword
		const direction = getDirection(startCoord.x, startCoord.y, endCoord.x, endCoord.y);

		for (let i = 0; i <= steps; i++) {
			const x = startCoord.x + direction.x * i;
			const y = startCoord.y + direction.y * i;
			const char = selected[i];

			if (char !== undefined) solved[y][x] = char;
		}

		const endWordCoord = {
			x: startCoord.x + direction.x * (selected.length - 1),
			y: startCoord.y + direction.y * (selected.length - 1)
		};

		onSuccessPlacement(selected, startCoord, endWordCoord);

		getIntersects(startCoord, endWordCoord, placedWords).forEach((item) => {
			item.coord.forEach((coord) => {
				const intersect = addIntersect(coord);
				wordIntersects[selected] = [...(wordIntersects[selected] ?? []), intersect];
				wordIntersects[item.item.value] = [...(wordIntersects[item.item.value] ?? []), intersect];
			});
		});

		if (selectedHighlight)
			wordAndHighlight = [
				...wordAndHighlight,
				{
					word: selected,
					highlight: selectedHighlight
				}
			];

		selectedHighlight = null;

		currentGrid.updateGrid(solved);
		previousSolved = solved;
		updateCurrentColor();
	};

	const isValidPlacement = (
		coords: { start: Coord; end: Coord },
		word: string,
		grid: string[][],
		allowOverflow = false
	) => {
		const { start, end } = coords;

		const distance = getSteps(start, end) + 1;

		const direction = getDirection(start.x, start.y, end.x, end.y);

		for (let i = 0; i < distance; i++) {
			let x = start.x + direction.x * i;
			let y = start.y + direction.y * i;

			let char = word[i];

			if (char === undefined && !allowOverflow) return false;
			if (char === undefined && allowOverflow) return true;

			let charInCell = grid[y][x];

			// skip if cell is considered 'empty'
			if (charInCell === EMPTY_CHAR) continue;

			if (charInCell !== char) return false;
		}
		return true;
	};

	const fillEmptyCell = (grid: string[][]) => {
		const CHARACTERS = 'abcdefghijklmnopqrstuvwxyz';
		const filled = grid.map((row) =>
			row.map((cell) =>
				cell === EMPTY_CHAR ? CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)] : cell
			)
		);

		return filled;
	};

	const handleCellMove: OnCellMove = (start, current, highlight, options) => {
		if (!updateHighlight) updateHighlight = options.updateHighlight;
		if (!removeHighlight) removeHighlight = options.removeHighlight;

		if (selected.length < 1 || hasSelectedPlaced) {
			// trick to make highlight dissapear
			highlight.updateCurrentHighlight({
				color: 'transparent',
				width: 0
			});
			return;
		}

		// skip on invalid current
		if (!current) return;

		const { calcHighlightWidth } = highlight;

		// get angle
		const currAngle = validateAngle(start, current);

		// skip invalid angle
		if (currAngle === false) return;

		if (currAngle !== angle) {
			angle = currAngle;
			restoreSolved();
		}

		const pathLength = getSteps(start, current) + 1;

		const direction = getDirection(start.x, start.y, current.x, current.y);

		const wordLength = selected.length;

		if (!selectedHighlight) {
			selectedHighlight = options.addHighlight({
				angle: currAngle,
				color: $currentColor,
				start: start,
				end: current,
				width: calcHighlightWidth(start, current),
				outline: 'none'
			});
		}

		// wordLength - 1 is to count for 0 based grid
		const validLength = getMaxValidLength(selected, start, direction, solved);
		const maxCoord: Coord = {
			x: direction.x * (validLength - 1) + start.x,
			y: direction.y * (validLength - 1) + start.y
		};

		options.updateHighlight(selectedHighlight.id, {
			angle: currAngle,
			color: $currentColor,
			start,
			end: current,
			width: calcHighlightWidth(start, pathLength > validLength ? maxCoord : current)
		});
		selectedHighlight = {
			...selectedHighlight,
			...{
				angle: currAngle,
				color: $currentColor,
				start,
				end: current,
				width: calcHighlightWidth(start, pathLength > validLength ? maxCoord : current)
			}
		};

		for (let i = 0; i < pathLength; i++) {
			const x = start.x + direction.x * i;
			const y = start.y + direction.y * i;
			const char = selected[i];

			if (!char) return;

			const charInCell = solved[y][x];

			if (charInCell !== EMPTY_CHAR && charInCell !== char) return;

			solved[y][x] = char;
			activateCells([{ x, y }]);
		}
	};

	// get maximum valid length of word in grid and return the last length
	// before clashing with another character in grid
	const getMaxValidLength = (
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

		const steps = getSteps(start, end) + 1;

		let count = 0;

		for (let i = 0; i < steps; i++) {
			const x = start.x + direction.x * i;
			const y = start.y + direction.y * i;

			if (y > grid.length || y < 0 || x > grid[0].length || x < 0) break;

			let char = word[i];
			let cell = grid[y][x];

			if (cell === char || cell === EMPTY_CHAR) count++;
		}

		return count;
	};

	const restoreSolved = () => {
		solved = [...previousSolved.map((i) => i.slice())];
	};

	const clearCells = (start: Coord, end: Coord, grid: string[][], excepts?: Coord[]) => {
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

	const getIntersects = (start: Coord, end: Coord, items: WordInGrid[]) => {
		let intersects: { item: WordInGrid; coord: Coord[] }[] = [];

		for (let i = 0; i < items.length; i++) {
			const item = items[i];

			let parallelOverlaps = parallelLineOverlap(
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

	let intersectId = 0;
	const addIntersect = (coord: Coord) => {
		intersectId++;
		intersections[intersectId] = coord;
		return intersectId;
	};

	const getPlacedWord = (coord: Coord, placedWords: WordInGrid[]) => {
		for (let i = 0; i < placedWords.length; i++) {
			const placed = placedWords[i];
			if (isCoordOnLine(coord, placed)) return placed;
		}

		return null;
	};

	const getRangeCoords = (start: Coord, end: Coord) => {
		const steps = getSteps(start, end);
		const direction = getDirection(start.x, start.y, end.x, end.y);
		const coords: Coord[] = [];
		for (let i = 0; i <= steps; i++) {
			const x = start.x + direction.x * i;
			const y = start.y + direction.y * i;
			coords.push({ x, y });
		}

		return coords;
	};

	const getCell = (coord: Coord) => {
		const cell = document.querySelector(`[data-coord="${coord.x},${coord.y}"]`);
		return cell;
	};
	const activateCells = (coords: Coord[]) => {
		coords.forEach((coord) => {
			const cell = getCell(coord);
			cell?.classList.add('active');
		});
	};

	const deactivateCells = (coords: Coord[]) => {
		coords.forEach((coord) => {
			const cell = getCell(coord);
			cell?.classList.remove('active');
		});
	};
</script>

<div id="interactive-word-placement" class="w-full p-4">
	<Grid words={[]} options={gridOptions} {handleCellPress} {handleCellRelease} {handleCellMove} />
</div>

<style lang="scss">
	#interactive-word-placement {
		:global(.cell-container) {
			@apply outline outline-1 outline-slate-400;
		}

		:global(#ck-grid) {
			@apply rounded-lg overflow-hidden outline outline-2 outline-slate-400;
		}

		:global(.cell.active) {
			@apply text-slate-50;
		}
	}
</style>
