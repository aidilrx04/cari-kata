<script lang="ts">
	import { currentColor, updateCurrentColor } from '$lib/colors';
	import type {
		Coord,
		GridOptions,
		HighlightData,
		OnCellMoveFunction,
		OnCellPressFunction,
		OnCellReleaseFunction,
		OnSuccessPlacement
	} from '$lib/types';
	import { getDirection, getSteps, validateAngle } from '$lib/util';
	import Grid from '../game/Grid.svelte';

	export let rows: number;
	export let columns: number;
	export let selected = '';

	export let onSuccessPlacement: OnSuccessPlacement = () => {};

	let previousRows: number = rows;
	let previousColumns: number = columns;

	let emptyChar = '*';
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
				result.push(Array(currentCols).fill(emptyChar));
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
				result[i] = [...result[i], ...Array(totalCols).fill(emptyChar)];
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
			.map(() => Array(columns).fill(emptyChar));
		return result;
	}

	const handleCellPress: OnCellPressFunction = (cell, grid) => {
		// save grid state
		previousSolved = [...grid.grid.map((i) => i.slice())];
		startCoord = cell.coord;
	};

	const handleCellRelease: OnCellReleaseFunction = (cell, currentGrid) => {
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
			solved = [...previousSolved.map((i) => i.slice())];
			if (selectedHighlight !== null) {
				removeHighlight(selectedHighlight.id);
				selectedHighlight = null;
			}
			return;
		}

		selectedHighlight = null;

		// placeword
		const direction = getDirection(startCoord.x, startCoord.y, endCoord.x, endCoord.y);

		for (let i = 0; i <= steps; i++) {
			const x = startCoord.x + direction.x * i;
			const y = startCoord.y + direction.y * i;
			const char = selected[i];

			if (char !== undefined) solved[y][x] = char;
		}

		onSuccessPlacement(selected);

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
			if (charInCell === emptyChar) continue;

			if (charInCell !== char) return false;
		}
		return true;
	};

	const fillEmptyCell = (grid: string[][]) => {
		const CHARACTERS = 'abcdefghijklmnopqrstuvwxyz';
		const filled = grid.map((row) =>
			row.map((cell) =>
				cell === emptyChar ? CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)] : cell
			)
		);

		return filled;
	};

	const handleCellMove: OnCellMoveFunction = (start, current, highlight, options) => {
		if (!updateHighlight) updateHighlight = options.updateHighlight;
		if (!removeHighlight) removeHighlight = options.removeHighlight;

		// skip on invalid current
		if (!current) return;

		const { calcHighlightWidth } = highlight;

		// get angle
		const currAngle = validateAngle(start, current);

		// skip invalid angle
		if (currAngle === false) return;

		if (currAngle !== angle) {
			angle = currAngle;
			solved = [...previousSolved.map((i) => i.slice())];
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
				width: calcHighlightWidth(start, current)
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

		for (let i = 0; i < pathLength; i++) {
			const x = start.x + direction.x * i;
			const y = start.y + direction.y * i;
			const char = selected[i];

			if (!char) return;

			const charInCell = solved[y][x];

			if (charInCell !== emptyChar && charInCell !== char) return;

			solved[y][x] = char;
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

			if (cell === char || cell === emptyChar) count++;
		}

		return count;
	};
</script>

<div id="interactive-word-placement">
	<Grid words={[]} options={gridOptions} {handleCellPress} {handleCellRelease} {handleCellMove} />
</div>
