<script lang="ts">
	import { currentColor } from '$lib/colors';
	import Board from '$lib/components/Board.svelte';
	import { getRangeCoords } from '$lib/create';
	import type {
		ActivateCells,
		AddHighlight,
		Coord,
		DeactivateCells,
		HighlightData,
		OnCellPress,
		OnCellRelease,
		ResetCells,
		WordInGrid
	} from '$lib/types';
	import { getAngle } from '$lib/util';

	export let grid: string[][];
	export let rows: number;
	export let columns: number;
	export let words: WordInGrid[];
	export let solveds: {
		word: WordInGrid;
		highlight: HighlightData;
	}[] = [];

	let wordCoords: { start: Coord; end: Coord }[] = [];
	$: wordCoords = words.map(({ start, end }) => ({ start, end }));

	let start: Coord;
	let end: Coord;

	$: if (start && end) {
		const answer = findAnswer(start, end, wordCoords);
		console.log(answer);
		if (answer >= 0) {
			const word = words[answer];

			const highlight = addHighlight({
				color: $currentColor,
				start,
				end,
				angle: getAngle(start.x, start.y, end.x, end.y)
			});

			const coords = getRangeCoords(start, end);
			activateCells(coords);

			solveds = [...solveds, { word, highlight }];
		}
	}

	let addHighlight: AddHighlight;
	let activateCells: ActivateCells;
	let deactivateCells: DeactivateCells;
	let resetCells: ResetCells;

	const handleCellPress: OnCellPress = ({ coord }) => {
		start = coord;
	};
	const handleCellRelease: OnCellRelease = ({ coord, valid }) => {
		if (valid) {
			end = coord;
		}
	};

	const findAnswer = (start: Coord, end: Coord, searchCoords: typeof wordCoords): number => {
		for (let i = 0; i < searchCoords.length; i++) {
			let coord = searchCoords[i];

			// normal order left -> right, top -> bottom word order
			if (isCoordEqual(start, coord.start) && isCoordEqual(end, coord.end)) {
				console.log('balls');
				return i;
			}

			// reverse order right -> left, bottom -> top word order
			if (isCoordEqual(start, coord.end) && isCoordEqual(end, coord.start)) {
				return i;
			}
		}

		return -1;
	};

	const isCoordEqual = (a: Coord, b: Coord) => {
		if (a.x === b.x && a.y === b.y) return true;
		return false;
	};
</script>

<Board
	{grid}
	{rows}
	{columns}
	{handleCellPress}
	{handleCellRelease}
	bind:addHighlight
	bind:activateCells
	bind:resetCells
	bind:deactivateCells
/>
