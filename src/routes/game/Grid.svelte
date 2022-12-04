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
		hideFiller
	} from '$lib/stores';
	import { onMount } from 'svelte';

	export let words: string[];
	export let columns: number;
	export let rows: number;

	const { grid, solved, words: gridWords } = wordsearch(words, columns, rows);

	let gridContainer: HTMLDivElement;

	// actual grid for calculation and rendering
	$wordsStore = gridWords;

	$: if ($hideFiller) {
		$gridStore = solved;
	} else {
		$gridStore = grid;
	}

	// effects
	$: if ($gridRect) {
		$CELL_WIDTH = $gridRect.width / columns;
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
	style="position: relative; top: 0; left: 50%; transform: translate(-50%, 0)"
>
	<Highlights />
	<div id="grid">
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
	#grid-container {
		width: 300px;
		max-width: 100%;
		min-width: 200px;
	}
</style>