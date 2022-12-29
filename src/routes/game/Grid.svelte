<script lang="ts">
	import { wordsearch } from '$lib/wordsearch';
	import Highlights from './Highlights.svelte';
	import Row from './Row.svelte';
	import Cell from './Cell.svelte';
	import {
		CELL_WIDTH,
		currentColor,
		foundWords,
		grid as gridStore,
		hideFiller,
		words as wordsStore
	} from '$lib/stores/game';
	import { onMount } from 'svelte';
	import type { Mode } from '$lib/modes';
	import type { Cells, Highlight, Word } from '$lib/types';
	import { onDestroy } from 'svelte';
	import { colors, getDirection, validatePath } from '$lib/util';

	import DingSound from '$lib/audio/ding-smol.mp3';

	let ding: HTMLAudioElement;

	export let words: Word[];
	export let type: Mode;

	let validateAnswer = false;
	let cells: Cells = {
		start: [],
		end: []
	};
	let highlights: Highlight[] = [];
	let isMouseDown = false;
	let isTouchDown = false;

	let gridRect: DOMRect;
	let coords: number[][] = [];

	const {
		grid,
		solved,
		words: gridWords
	} = wordsearch(
		words.map((word) => word.word),
		type.grid.column,
		type.grid.row,
		{
			backwards: type.backwordProb,
			totalWordsInGrid: type.words
		}
	);

	let gridContainer: HTMLDivElement;

	// actual grid for calculation and rendering
	$wordsStore = gridWords.map((word, i) => ({
		id: i,
		word: word,
		length: word.length,
		displayText: word
	}));

	if (type.preprocess) {
		$wordsStore = type.preprocess($wordsStore);
	}

	$: if ($hideFiller) {
		$gridStore = solved;
	} else {
		$gridStore = grid;
	}

	// effects
	$: if (gridRect) {
		$CELL_WIDTH = gridRect.width / type.grid.column;
	}

	$: if ($foundWords.length > 0) {
		// coords = $foundWords.map((found) => found.coord).reduce((acc, coord) => [...acc, coord], []);
		// coords = $foundWords.map((found) => found.coord).reduce((acc, coord) => [...acc, coord], []);
		const cc = $foundWords.map((found) => found.coord);
		const dd = cc.flat(1);
		// flaten
		coords = dd;
	}

	// lifecycle events
	onMount(() => {
		setGridRect();
	});

	onDestroy(() => {
		validateAnswer = false;
		cells = {
			start: [],
			end: []
		};
		highlights = [];
		isMouseDown = false;
		isTouchDown = false;
		coords = [];
		$wordsStore = [];
		$CELL_WIDTH = 0;
		$gridStore = [];
		ding.pause();
	});

	const setGridRect = () => {
		gridRect = gridContainer.getBoundingClientRect();
	};

	const handleGridRectChange = () => {
		setGridRect();
	};

	// effects
	$: if (validateAnswer) {
		// wait for direction to set up first
		const answer = validatePoints(cells);
		// reset back answer chcking
		validateAnswer = false;
		resetCells();
		if (answer) {
			ding.play();
			let { word, coords, ...highlight } = answer;
			highlights = [...highlights, { ...highlight, color: $currentColor }];
			$foundWords = [
				...$foundWords,
				{
					word: $wordsStore[$wordsStore.map((word) => word.word).findIndex((n) => n === word)],
					coord: coords,
					color: $currentColor
				}
			];
			// $foundWords = {
			// 	words: [...$foundWords.words, word],
			// 	coords: [...$foundWords.coords, ...coords],
			// 	colors: [...$foundWords.colors, $currentColor]
			// };
			$currentColor = colors[Math.floor(Math.random() * colors.length)];
		}
	}

	/** validate points in cellcoord*/
	const validatePoints = (points: { start: number[]; end: number[] }) => {
		const validPath = validatePath(points.start, points.end);
		if (validPath === false) return;
		const angle = validPath;

		const chars: string[] = [];
		const coords: number[][] = [];
		const direction = getDirection(cells.start[0], cells.start[1], cells.end[0], cells.end[1]);

		// up and down
		const specialAngle = [90, -90];

		let totalSteps = Math.abs(cells.end[0] - cells.start[0]);
		if (specialAngle.includes(angle)) totalSteps = Math.abs(cells.end[1] - cells.start[1]);

		// get each character in path from grid
		for (let i = 0; i <= totalSteps; i++) {
			const nextStepX = direction.x * i;
			const nextStepY = direction.y * i;

			const xCoord = cells.start[0] + nextStepX;
			const yCoord = cells.start[1] + nextStepY;

			// start coord as the base
			const charInGrid = grid[yCoord][xCoord];

			coords.push([xCoord, yCoord]);
			chars.push(charInGrid);
		}

		// validate each cell
		let combinedChars = chars.join('');
		let combinedBackwordChars = chars.reverse().join('');
		const wordsString = words.map((word) => word.word);
		const wordIndex = wordsString.indexOf(combinedChars);
		const backwordIndex = wordsString.indexOf(combinedBackwordChars);
		let isBackword = false;
		// invalid word
		if (wordIndex < 0 && backwordIndex < 0) {
			console.info(`[vp]invalid word => ${combinedChars} | ${combinedBackwordChars}`);
			return;
		}

		if (wordIndex < 0) {
			isBackword = true;
		}

		let word = isBackword ? combinedBackwordChars : combinedChars;

		if ($foundWords.map((found) => found.word.word).includes(word)) {
			return;
		}

		console.info(`[vp]found  ${word}`);

		const result = {
			word: word,
			coords: coords,
			rotation: angle,
			start: cells.start,
			end: cells.end
		};

		return result;
	};

	const resetCells = () => {
		cells = { start: [], end: [] };
	};
</script>

<svelte:window on:resize={handleGridRectChange} on:scroll={handleGridRectChange} />

<!-- Sound Effect from <a href="https://pixabay.com/sound-effects/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=40142">Pixabay</a> -->
<audio src={DingSound} class="absolute -left-full -top-full" bind:this={ding} />
<div
	id="grid-container"
	bind:this={gridContainer}
	class="
default: mb-3 mx-auto
sma: sm:w-full sm:max-w-[360px]
med: 
lar: lg:
w-full
"
>
	<Highlights {...{ gridRect, isMouseDown, highlights, cells, isTouchDown }} />
	<div id="grid" class="bg-gray-50 rounded-md shadow-md">
		{#each $gridStore as row, r}
			<Row>
				{#each row as cell, c}
					{#if $CELL_WIDTH > 0}
						<Cell
							coord={[c, r]}
							on:mousedown
							on:mouseup
							bind:validateAnswer
							bind:cells
							bind:isMouseDown
							bind:isTouchDown
							{coords}
						>
							{cell.trim() === '' ? '-' : cell}
						</Cell>
					{/if}
				{/each}
			</Row>
		{/each}
	</div>
</div>

<style>
</style>
