<script context="module" lang="ts">
	// use by outside the file
	export const cellWidth = writable(0);
	export const cellHeight = writable(0);
	export const startCoord = writable<Coord | undefined>();
	export const endCoord = writable<Coord | undefined>();
	export const isPressing = writable(false);
</script>

<script lang="ts">
	import type { ComponentEvents } from 'svelte';
	import Cell from './Cell.svelte';
	import type { Coord, Solved, Word } from '$lib/types';
	import { writable } from 'svelte/store';
	import { getDirection, validatePath } from '$lib/util';
	import { currentColor } from '$lib/colors';
	import { updateCurrentColor } from '$lib/colors';

	export let grid: string[][];
	export let words: Word[];
	export let solvedWords: Solved[];

	let solvedWordsCoords: Coord[];
	$: solvedWordsCoords = solvedWords
		.map((solved) => solved.coords)
		.reduce((acc, coords) => [...acc, ...coords], []);

	// container rect
	export let containerRect: DOMRect;
	// grid column
	export let column: number;

	// set the cellWidth and cellHeight based on containerRect
	$: {
		$cellWidth = containerRect?.width / column;
		$cellHeight = $cellWidth;
	}

	const handleCellPress = (e: ComponentEvents<Cell>['pressedOn']) => {
		$startCoord = e.detail.coord;
		$isPressing = true;
	};

	const handleCellRelease = (e: ComponentEvents<Cell>['releasedOn']) => {
		$endCoord = e.detail.coord;
		$isPressing = false;
		calculateAnswer();
	};

	const calculateAnswer = () => {
		if ($startCoord === undefined || $endCoord === undefined) return;

		// check if start and end coord is set
		if (!$startCoord || !$endCoord) return;

		// validate the path between start and end
		// only accept <degree> % 45 == 0
		const angleOrInvalid = validatePath($startCoord, $endCoord);
		if (angleOrInvalid === false) return;

		const { word, coords } = getWordFromCoord($startCoord, $endCoord, angleOrInvalid, grid);

		const validWord = validateWord(word, words);

		if (!validWord.valid) {
			console.log(`${word} is not a valid answer`);
			return;
		}

		// get real word if the path is backword
		let solidWord = !validWord.backword ? word : [...word].reverse().join('');

		// skip if word already found
		const solvedWordsWords = solvedWords.map((word) => word.word);
		if (solvedWordsWords.includes(solidWord)) return;

		solvedWords = [
			...solvedWords,
			{
				word: solidWord,
				coords: coords,
				angle: angleOrInvalid,
				color: $currentColor
			}
		];
		// change to new color
		updateCurrentColor();
	};

	export const getWordFromCoord = (start: Coord, end: Coord, angle: number, grid: string[][]) => {
		const direction = getDirection(start.x, start.y, end.x, end.y);

		const chars: string[] = [];
		const coords: Coord[] = [];

		let distance = Math.abs(end.x - start.x);

		// up and down direction doesnt work with normal distance calculation
		const specialAngle = [90, -90];
		if (specialAngle.includes(angle)) distance = Math.abs(end.y - start.y);

		// get each character in path from grid
		for (let i = 0; i <= distance; i++) {
			const nextStepX = direction.x * i;
			const nextStepY = direction.y * i;

			const x = start.x + nextStepX;
			const y = start.y + nextStepY;

			// start coord as the base
			const charInGrid = grid[y][x];

			coords.push({ x: x, y: y });
			chars.push(charInGrid);
		}

		return {
			word: chars.join(''),
			coords
		};
	};

	export const validateWord = (word: string, words: Word[]) => {
		const wordValues = words.map((word) => word.value);
		const reversedWords = wordValues.map((word) => [...word].reverse().join(''));

		const index = wordValues.indexOf(word);
		if (index >= 0) return { backword: false, valid: true };

		const backwordIndex = reversedWords.indexOf(word);
		if (backwordIndex >= 0) return { backword: true, valid: true };

		return { backword: false, valid: false };
	};

	const handleInvalidRelease = () => {
		// and dont set endCoord because the mouseup element is invalid

		// set isPressing to false
		$isPressing = false;
	};

	const isCellFound = (coord: Coord, searchCoords: Coord[]) => {
		return (
			searchCoords.findIndex(
				(searchCoord) => searchCoord.x === coord.x && searchCoord.y === coord.y
			) >= 0
		);
	};
</script>

<svelte:document on:mouseup={handleInvalidRelease} />

{#each grid as row, i}
	{#each row as letter, j}
		<Cell
			coord={{ x: j, y: i }}
			width={$cellWidth}
			height={$cellHeight}
			on:pressedOn={handleCellPress}
			on:releasedOn={handleCellRelease}
			found={isCellFound({ x: j, y: i }, solvedWordsCoords)}
		>
			{letter}
		</Cell>
	{/each}
{/each}
