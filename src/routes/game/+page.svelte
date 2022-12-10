<script lang="ts">
	import Navigation from '$lib/Navigation.svelte';
	import Modal from '$lib/Modal.svelte';
	import {
		cells,
		CELL_WIDTH,
		currentColor,
		foundWords,
		grid,
		gridRect,
		hideFiller,
		highlights,
		isGameStarted,
		isMouseDown,
		startTime,
		validateAnswer,
		words
	} from '$lib/stores';
	import Timer from '$lib/Timer.svelte';
	import { colors, getDirection, validatePath } from '$lib/util';
	import type { PageData } from './$types';
	import Grid from './Grid.svelte';
	import Words from './Words.svelte';
	import { onDestroy } from 'svelte';
	import { MODES } from '$lib/modes';

	export let data: PageData;

	const title = {
		[MODES.EASY]: 'Mudah',
		[MODES.NORMAL]: 'Serdahana',
		[MODES.HARD]: 'Sukar'
	};
	const gameInfo = {
		title: title[data.type.type],
		grid: data.type.grid
	};

	onDestroy(() => {
		resetStates();
	});

	// effects
	$: if ($validateAnswer) {
		// wait for direction to set up first
		const answer = validatePoints($cells);
		// reset back answer chcking
		$validateAnswer = false;
		resetCells();
		if (answer) {
			let { word, coords, ...highlight } = answer;
			$highlights = [...$highlights, { ...highlight, color: $currentColor }];
			$foundWords = {
				words: [...$foundWords.words, word],
				coords: [...$foundWords.coords, ...coords],
				colors: [...$foundWords.colors, $currentColor]
			};
			$currentColor = colors[Math.floor(Math.random() * colors.length)];
		}
	}

	// helper fns

	/** validate points in cellcoord*/
	const validatePoints = (points: { start: number[]; end: number[] }) => {
		const validPath = validatePath(points.start, points.end);
		if (validPath === false) return;
		const angle = validPath;

		const chars: string[] = [];
		const coords: number[][] = [];
		const direction = getDirection($cells.start[0], $cells.start[1], $cells.end[0], $cells.end[1]);

		// up and down
		const specialAngle = [90, -90];

		let totalSteps = Math.abs($cells.end[0] - $cells.start[0]);
		if (specialAngle.includes(angle)) totalSteps = Math.abs($cells.end[1] - $cells.start[1]);

		// get each character in path from grid
		for (let i = 0; i <= totalSteps; i++) {
			const nextStepX = direction.x * i;
			const nextStepY = direction.y * i;

			const xCoord = $cells.start[0] + nextStepX;
			const yCoord = $cells.start[1] + nextStepY;

			// start coord as the base
			const charInGrid = $grid[yCoord][xCoord];

			coords.push([xCoord, yCoord]);
			chars.push(charInGrid);
		}

		// validate each cell
		let combinedChars = chars.join('');
		const wordIndex = $words.indexOf(combinedChars);
		// invalid word
		if (wordIndex < 0) {
			console.info('[vp]invalid word');
			return;
		}
		console.info('[vp]found ' + combinedChars);

		const result = {
			word: combinedChars,
			coords: coords,
			rotation: angle,
			start: $cells.start,
			end: $cells.end
		};

		return result;
	};

	const resetCells = () => {
		$cells = { start: [], end: [] };
	};

	const resetStates = () => {
		$grid = [];
		$words = [];
		$CELL_WIDTH = 0;
		$validateAnswer = false;
		$cells = { start: [], end: [] };
		$isMouseDown = false;
		$highlights = [];
		$foundWords = {
			words: [],
			coords: [],
			colors: []
		};

		$hideFiller = false;
		$isGameStarted = false;
	};
</script>

<div class="px-2 max-w-[360px] mx-auto">
	<header>
		<Navigation />
	</header>

	<main>
		<header class="flex items-center justify-between">
			<div class="title">
				<h2 class="text-2xl text-slate-900 font-semibold">{gameInfo.title}</h2>
				<small class="text-sm font-semibold text-slate-600">
					{gameInfo.grid.column}x{gameInfo.grid.row} GRID
				</small>
			</div>
			<div class="timer flex flex-col items-end justify-center">
				<small class="label text-xs font-bold text-slate-600 uppercase">MASA</small>
				{#if $startTime}
					<Timer
						startAt={$startTime}
						startCounting={$isGameStarted}
						_class="block text-slate-800 text-3xl"
					/>
				{:else}
					<span class="placeholder block text-slate-800 text-3xl">00:00</span>
				{/if}
			</div>
		</header>

		<button on:click={() => ($hideFiller = !$hideFiller)}
			>{$hideFiller ? 'Show' : 'Hide'} filler</button
		>

		<div class="game mt-3">
			{#if $isGameStarted}
				<Grid words={data.words.map((word) => word.word)} type={data.type} />

				<Words />
			{:else}
				<div class="relative max-w-full">
					<Modal _class="bg-gray-50 w-[250px] max-w-full px-2 py-1 shadow top-[70%] rounded">
						<div slot="header" class="text-xl text-center mb-2">Cari Kata</div>
						<div class="content">
							<button
								on:click={() => ($isGameStarted = true)}
								class="px-6 py-2 block mx-auto bg-violet-600 text-gray-50 text-xl mt-2 mb-3 rounded shadow-sm hover:bg-violet-700 transition-colors"
								>Main</button
							>
						</div>
						<div slot="footer" />
					</Modal>
				</div>
			{/if}
		</div>
	</main>
</div>
