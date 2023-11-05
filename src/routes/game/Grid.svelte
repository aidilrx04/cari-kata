<script lang="ts">
	import { wordsearch } from '$lib/wordsearch';
	import { onMount } from 'svelte';
	import type { Solved } from '$lib/types';
	import CellsManager from './CellsManager.svelte';
	import HighlightManager from './HighlightManager.svelte';
	import { ResizeObserver } from '@juggle/resize-observer';

	// words used to placed in the grid
	export let words: string[];

	export let wordsInGrid: string[] = [];
	export let solvedWords: Solved[] = []; // populate by cellsmanager

	// grid options
	export let options = {
		row: 15,
		col: 15
	};

	// grid containers scambled letters
	let grid: string[][] = [];

	let container: HTMLDivElement;

	// ! BUG FATAL and EDGE CASE?:
	// containerRect will reupdate back and forth if the cells height
	// plus, using container to calc the width is much smoother than grid auto width
	let containerRect: DOMRect;

	// WARN: on certain height, the observer will continously trigger the setContainerRect
	// because CellManager will render the cells that overflow the page and change of container rect,
	// which will then trigger the observer which will then rerender back
	const containerObserver = new ResizeObserver((entries) => {
		// update the container rect
		if (container) setContainerRect();
	});

	const containerWidth = 360; // px

	// observer container rect size change
	$: if (container) {
		containerObserver.observe(container);
	}

	onMount(() => {
		// create new grid
		const ws = wordsearch(words, options.col, options.row);
		grid = ws.solved;
		wordsInGrid = ws.words;

		setContainerRect();
	});

	export const setContainerRect = () => {
		containerRect = container.getBoundingClientRect();
	};
</script>

<svelte:window on:resize={setContainerRect} on:scroll={setContainerRect} />

<div
	class="ck-grid-container relative w-full mx-auto"
	style:max-width="{containerWidth}px"
	bind:this={container}
>
	<HighlightManager {solvedWords} {containerRect} />
	<div
		id="ck-grid"
		class=" grid relative"
		style:grid-template-rows="repeat({options.row}, minmax(0, 1fr))"
		style:grid-template-columns="repeat({options.col}, minmax(0, 1fr))"
	>
		{#if containerRect}
			<CellsManager {grid} {words} bind:solvedWords {containerRect} column={options.col} />
		{/if}
	</div>
</div>
