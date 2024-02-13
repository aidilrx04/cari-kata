<script lang="ts">
	import { onMount } from 'svelte';
	import type {
		OnCellPress,
		OnCellRelease,
		OnCellMove,
		AddHighlight,
		UpdateHighlight,
		RemoveHighlight
	} from '$lib/types';
	import CellsManager from './CellsManager.svelte';
	import HighlightManager from './HighlightManager.svelte';
	import { ResizeObserver } from '@juggle/resize-observer';

	// grid containers scambled letters
	export let grid: string[][];

	export let rows: number;
	export let columns: number;

	export let addHighlight: AddHighlight | undefined = undefined;
	export let updateHighlight: UpdateHighlight | undefined = undefined;
	export let removeHighlight: RemoveHighlight | undefined = undefined;

	export let handleCellPress: OnCellPress | undefined = undefined;
	export let handleCellRelease: OnCellRelease | undefined = undefined;
	export let handleCellMove: OnCellMove | undefined = undefined;

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
	<HighlightManager
		{containerRect}
		onCellMove={handleCellMove}
		bind:addHighlight
		bind:removeHighlight
		bind:updateHighlight
	/>
	<div
		id="ck-grid"
		class="grid relative bg-slate-50 dark:bg-slate-600 rounded-md"
		style:grid-template-rows="repeat({rows}, minmax(0, 1fr))"
		style:grid-template-columns="repeat({columns}, minmax(0, 1fr))"
	>
		{#if containerRect}
			<CellsManager
				onCellPress={handleCellPress}
				onCellRelease={handleCellRelease}
				{grid}
				{containerRect}
				column={columns}
			/>
		{/if}
	</div>
</div>
