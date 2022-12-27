<script lang="ts">
	import { wordsearch } from '$lib/wordsearch';
	import Highlights from './Highlights.svelte';
	import Row from './Row.svelte';
	import Cell from './Cell.svelte';
	import {
		CELL_WIDTH,
		grid as gridStore,
		words as wordsStore,
		gridRect,
		hideFiller,
		displayTexts
	} from '$lib/stores';
	import { onMount } from 'svelte';
	import type { Mode } from '$lib/modes';
	import type { Word } from '$lib/types';

	export let words: Word[];
	export let type: Mode;

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
	$wordsStore = gridWords;
	$displayTexts = type.preprocess
		? gridWords.map((word) => {
				const index = words.findIndex((w) => w.word === word);
				return words[index].displayText as string;
		  })
		: [...gridWords];

	$: console.log($wordsStore, $displayTexts);

	$: if ($hideFiller) {
		$gridStore = solved;
	} else {
		$gridStore = grid;
	}

	// effects
	$: if ($gridRect) {
		$CELL_WIDTH = $gridRect.width / type.grid.column;
	}

	// lifecycle events
	onMount(() => {
		setGridRect();
	});

	const setGridRect = () => {
		$gridRect = gridContainer.getBoundingClientRect();
	};

	const handleGridRectChange = () => {
		setGridRect();
	};

	// $: console.log($cells);
</script>

<svelte:window on:resize={handleGridRectChange} on:scroll={handleGridRectChange} />

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
	<Highlights />
	<div id="grid" class="bg-gray-50 rounded-md shadow-md">
		{#each $gridStore as row, r}
			<Row>
				{#each row as cell, c}
					{#if $CELL_WIDTH > 0}
						<Cell coord={[c, r]} on:mousedown on:mouseup>
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
