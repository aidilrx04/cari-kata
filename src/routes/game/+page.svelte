<script lang="ts">
	import {
		cells,
		currentColor,
		foundWords,
		grid,
		hideFiller,
		highlights,
		validateAnswer,
		words
	} from '$lib/stores';
	import { colors, getDirection, validatePath } from '$lib/util';
	import Grid from './Grid.svelte';
	import Words from './Words.svelte';

	const TOTAL_COLUMNS = 7;
	const TOTAL_ROWS = TOTAL_COLUMNS + 2;
	const _words = [
		{ id: 22072, word: 'tabut', length: 5 },
		{ id: 19911, word: 'salih', length: 5 },
		{ id: 24315, word: 'wahyu', length: 5 },
		{ id: 4512, word: 'cop', length: 3 },
		{ id: 12252, word: 'kupon', length: 5 },
		{ id: 9632, word: 'kecam', length: 5 },
		{ id: 7714, word: 'hirup', length: 5 },
		{ id: 19571, word: 'rokok', length: 5 },
		{ id: 4577, word: 'cuti', length: 4 },
		{ id: 5706, word: 'duduk', length: 5 }
	].map((word) => word.word);

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
</script>

<div class="px-2 max-w-[360px] mx-auto">
	<header class="flex items-center justify-between">
		<div class="title">
			<h2 class="text-2xl text-slate-900 font-semibold">Random Game</h2>
			<small class="text-sm font-semibold text-slate-600">Senang</small>
		</div>
		<div class="timer flex flex-col items-end justify-center">
			<small class="label text-xs font-bold text-slate-600 uppercase">MASA</small>
			<span class="block text-slate-800 text-3xl">00:15</span>
		</div>
	</header>

	<button on:click={() => ($hideFiller = !$hideFiller)}
		>{$hideFiller ? 'Show' : 'Hide'} filler</button
	>

	<div class="game mt-3">
		<Grid words={_words} columns={TOTAL_COLUMNS} rows={TOTAL_ROWS} />
		<Words />
	</div>
</div>
