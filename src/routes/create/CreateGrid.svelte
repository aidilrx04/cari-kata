<script lang="ts">
	import { browser } from '$app/environment';
	import { colors, currentColor, pickRandomColor, updateCurrentColor } from '$lib/colors';
	import {
		EMPTY_CHAR,
		createEmptyGrid,
		expandShrinkGrid,
		isValidPlacement,
		placeWords
	} from '$lib/create';
	import type {
		AddHighlight,
		Coord,
		GridOptions,
		HighlightData,
		OnCellMove,
		OnCellPress,
		OnCellRelease,
		OnSuccessPlacement,
		RemoveHighlight,
		UpdateHighlight,
		WordInGrid
	} from '$lib/types';
	import {
		getDirection,
		getSteps,
		parallelLineOverlap,
		line_intersect,
		isCoordOnLine,
		getAngle,
		binarySearch,
		getDirectionByAngle,
		getLineLength,
		getCoordIntersectPerpendicularOnAngle,
		getCoordFromString
	} from '$lib/util';
	import Grid from '../game/Grid.svelte';
	import rgba from 'color-rgba';
	// import { addHighlight, removeHighlight, updateHighlight } from '../game/HighlightManager.svelte';
	import { onMount } from 'svelte';

	export let rows: number;
	export let columns: number;
	export let selected: string = '';

	export let onSuccessPlacement: OnSuccessPlacement = () => {};

	let addHighlight: AddHighlight;
	let updateHighlight: UpdateHighlight;
	let removeHighlight: RemoveHighlight;

	let previousRows: number = rows;
	let previousColumns: number = columns;

	export let solved: string[][] = [];

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
	$: if (placedWords.length && browser) {
		grid = fillEmptyCell(solved);
	}
	// store previous grid state for redo/undo word placement
	let previousSolved: string[][];

	let startCoord: Coord;
	let endCoord: Coord;

	// show filled grid
	export let showGrid = true;
	$: if (showGrid) {
		deactivateUnplacedCells(placedCoords);
	}

	let gridOptions: GridOptions = {
		rows: rows,
		columns: columns,
		grid: solved,
		solved: solved
	};
	$: gridOptions = {
		rows: rows,
		columns: columns,
		grid: showGrid ? grid : solved,
		solved: solved
	};

	// current angle
	let angle: number;

	let selectedHighlight: HighlightData | null;

	export let placedWords: WordInGrid[];
	$: console.log(placedWords);

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
	$: if (placedWords && browser) {
		const coords = placedWords.map((i) => getRangeCoords(i.start, i.end)).flat();

		const changed = placedCoords.filter(
			(i) => coords.findIndex((j) => j.x === i.x && j.y === i.y) < 0
		);

		placedCoords = coords;
		deactivateCells(changed);
		activateCells(placedCoords);
	}

	// trick to slightly delay activate cells when the dom isnt fully loaded yet
	let firstTimeLoaded = true;
	$: if (firstTimeLoaded && browser) {
		new Promise((resolve, rejext) => {
			// poll until first cell is loaded
			let i = setInterval(() => {
				const loaded = getCell({ x: 0, y: 0 });
				if (loaded) {
					clearInterval(i);
					resolve(true);
				}
			}, 100);
		}).then(() => {
			firstTimeLoaded = false;
			togglePlacedWords(showHighlight);
		});
	}

	// show highlighted placed words
	export let showHighlight = true;

	$: {
		toggleHighlight(showHighlight);
		togglePlacedWords(showHighlight);
	}

	onMount(() => {
		// create empty grid
		solved = createEmptyGrid(rows, columns);

		// populate grid and the highlight if placedWords is present
		if (placedWords.length > 0) {
			solved = placeWords(solved, placedWords);

			placedWords.forEach((word) => {
				const wordHighlight = addHighlight({
					angle: getAngle(word.start.x, word.start.y, word.end.x, word.end.y),
					color: pickRandomColor(colors),
					end: word.end,
					start: word.start
				});
				wordAndHighlight = [
					...wordAndHighlight,
					{
						word: word.value,
						highlight: wordHighlight
					}
				];
			});

			toggleHighlight(showHighlight);
			togglePlacedWords(showHighlight);
		}
		grid = fillEmptyCell(solved);
	});

	const handleCellPress: OnCellPress = (cell, grid) => {
		if (showGrid) return;

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
		if (showGrid) return;

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
		if (selected.length < 1 || hasSelectedPlaced || showGrid) {
			// trick to make highlight dissapear
			highlight.updateCurrentHighlight({
				color: 'transparent',
				width: 0
			});
			return;
		}

		// skip on invalid current
		if (!current) return;

		// get angle
		const angles = [0, 45, 90, 135, 180, -45, -90, -135];
		const currAngle = getAngle(start.x, start.y, current.x, current.y);
		// snap currAngle to valid one
		const nearestValidAngle = getNearestAngle(currAngle, angles);

		if (nearestValidAngle !== angle) {
			angle = nearestValidAngle;
			restoreSolved();
		}

		const coordCurrentOnValidAngle = getCoordIntersectPerpendicularOnAngle(angle, start, current);

		// get x length of start to current if angle is diagonal
		const currentHighlightLength = [45, 135, -45, -135].includes(angle)
			? getSteps(start, {
					x: Math.round(coordCurrentOnValidAngle.x),
					y: Math.floor(coordCurrentOnValidAngle.y)
			  })
			: getLineLength(start, current);

		const direction = getDirectionByAngle(angle);

		// wordLength - 1 is to count for 0 based grid
		const maxValidLength = getMaxValidLength(selected, start, direction, solved);

		const validLength = Math.min(
			maxValidLength - 1,
			selected.length - 1,
			Math.floor(currentHighlightLength)
		);

		const endValidCoord = {
			x: direction.x * validLength + start.x,
			y: direction.y * validLength + start.y
		};

		endCoord = endValidCoord;

		if (!selectedHighlight) {
			selectedHighlight = options.addHighlight({
				angle: angle,
				color: $currentColor,
				start: start,
				end: endValidCoord,
				outline: 'none'
			});
		}
		selectedHighlight = {
			...selectedHighlight,
			...{
				angle: angle,
				color: $currentColor,
				start,
				end: endValidCoord
			}
		};
		options.updateHighlight(selectedHighlight.id, selectedHighlight);

		restoreSolved();
		for (let i = 0; i <= validLength; i++) {
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

		const steps = getSteps(start, end);

		let count = 0;

		for (let i = 0; i <= steps; i++) {
			const x = start.x + direction.x * i;
			const y = start.y + direction.y * i;

			if (y >= grid.length || y < 0 || x > grid[0].length || x < 0) break;

			let char = word[i];
			let cell = grid[y][x];

			if (cell !== char && cell !== EMPTY_CHAR) break;
			count++;
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
		if (!browser) {
			console.warn('This function must be only called on client!');

			return;
		}

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

	function getNearestAngle(angle: number, angles: number[]): number {
		// Ensure angles array is not empty
		if (angles.length === 0) {
			throw new Error('Angles array must not be empty.');
		}

		// Sort the angles array in ascending order
		angles.sort((a, b) => a - b);

		// Find the index of the angle in the sorted array
		const index = binarySearch(angle, angles);

		// Check if the angle is exactly equal to one of the values in the array
		if (index !== -1 && angles[index] === angle) {
			return angle; // Angle is in the array, no need to snap
		} else {
			// Find the two nearest angles
			const lowerAngle = angles[index];
			const upperAngle = angles[index + 1];

			// Snap to the nearest angle
			if (upperAngle === undefined || Math.abs(angle - lowerAngle) < Math.abs(angle - upperAngle)) {
				return lowerAngle;
			} else {
				return upperAngle;
			}
		}
	}

	const toggleGrid = () => {
		showGrid = !showGrid;

		toggleHighlight(!showGrid);
		togglePlacedWords(!showGrid);
	};

	const toggleHighlight = (show: boolean) => {
		wordAndHighlight.forEach(({ highlight }) => {
			updateHighlight(highlight.id, {
				color: show ? highlight.color : 'transparent'
			});
		});
	};

	const togglePlacedWords = (show: boolean) => {
		placedWords.forEach((word) => {
			const coords = getRangeCoords(word.start, word.end);
			if (show) {
				activateCells(coords);
			} else {
				deactivateCells(coords);
			}
		});
	};

	const deactivateUnplacedCells = (validCells: Coord[]) => {
		if (!browser) {
			console.warn('This function is called on server! not client');
			return;
		}

		const containerID = '#interactive-word-placement';
		const activeCells = document.querySelectorAll<HTMLElement>(`${containerID} .cell.active`);
		activeCells.forEach((cell) => {
			const dataCoord = cell?.dataset?.coord;
			if (!dataCoord) return;

			const coord = getCoordFromString(dataCoord);

			const isPlaced = validCells.findIndex((c) => c.x === coord.x && c.y === coord.y) >= 0;

			if (isPlaced) return;

			cell.classList.remove('active');
		});
	};
</script>

<div id="interactive-word-placement" class="w-full p-4">
	<div class="top mb-2 flex items-center justify-end">
		<button
			type="button"
			on:click={toggleGrid}
			class="py-2 px-3 border rounded border-slate-200 flex items-center justify-center gap-2"
		>
			{#if showGrid}
				<i class="ph ph-pen" />
				<span>Edit</span>
			{:else}
				<i class="ph ph-squares-four" />
				<span>Grid</span>
			{/if}
		</button>
	</div>
	<Grid
		grid={gridOptions.grid}
		{columns}
		{rows}
		{handleCellPress}
		{handleCellRelease}
		{handleCellMove}
		bind:addHighlight
		bind:updateHighlight
		bind:removeHighlight
	/>
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
