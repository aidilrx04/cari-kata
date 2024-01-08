<script lang="ts">
	import { wordsearch } from '$lib/wordsearch';
	import { onMount } from 'svelte';
	import type {
		Solved,
		GridOptions,
		Word,
		OnCellPressFunction,
		OnCellReleaseFunction,
		OnCellMoveFunction,
		HighlightData
	} from '$lib/types';
	import CellsManager from './CellsManager.svelte';
	import HighlightManager from './HighlightManager.svelte';
	import { ResizeObserver } from '@juggle/resize-observer';

	// words used to placed in the grid
	export let words: Word[];

	export let solvedWords: Solved[] = []; // populate by cellsmanager

	// grid options
	export let options: GridOptions;

	export let handleCellPress: OnCellPressFunction | undefined = undefined;
	export let handleCellRelease: OnCellReleaseFunction | undefined = undefined;
	export let handleCellMove: OnCellMoveFunction<HighlightData> | undefined = undefined;

	// grid containers scambled letters
	let grid: string[][];
	$: grid = options.grid;

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
		setContainerRect();
	});

	export const setContainerRect = () => {
		containerRect = container.getBoundingClientRect();
	};
</script>

<svelte:window on:resize={setContainerRect} on:scroll={setContainerRect} />

<div
	class="ck-grid-container relative w-full mx-auto mb-3 lg:mb-0"
	style:max-width="{containerWidth}px"
	bind:this={container}
>
	<HighlightManager {solvedWords} {containerRect} onCellMove={handleCellMove} />
	<div
		id="ck-grid"
		class="grid relative bg-slate-50 dark:bg-slate-600 rounded-md"
		style:grid-template-rows="repeat({options.rows}, minmax(0, 1fr))"
		style:grid-template-columns="repeat({options.columns}, minmax(0, 1fr))"
	>
		{#if containerRect}
			<CellsManager
				onCellPress={handleCellPress}
				onCellRelease={handleCellRelease}
				{grid}
				{words}
				bind:solvedWords
				{containerRect}
				column={options.columns}
			/>
		{/if}
	</div>
</div>
