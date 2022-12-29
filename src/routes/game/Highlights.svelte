<script lang="ts">
	import type { Cells, Highlight as HighlightType } from '$lib/types';
	import { CELL_WIDTH, currentColor } from '$lib/stores/game';
	import { getAngle } from '$lib/util';
	import Highlight from './Highlight.svelte';
	import { onDestroy } from 'svelte';

	export let cells: Cells;
	export let isMouseDown: boolean;
	export let isTouchDown: boolean;
	export let highlights: HighlightType[];
	export let gridRect: DOMRect;

	// mouse
	let mouse = {
		x: 0,
		y: 0
	};

	const setMousePosition = (e: MouseEvent) => {
		mouse = {
			x: e.pageX,
			y: e.pageY
		};
	};

	// touch
	let touch = {
		x: 0,
		y: 0
	};

	const setTouchPosition = (e: TouchEvent) => {
		const touchEl = e.touches[0];
		touch = {
			x: touchEl.pageX,
			y: touchEl.pageY
		};
	};

	onDestroy(() => {
		mouse = {
			x: 0,
			y: 0
		};

		touch = {
			x: 0,
			y: 0
		};
	});
</script>

<svelte:window on:mousemove={setMousePosition} />
<svelte:body on:touchmove={setTouchPosition} on:touchstart={setTouchPosition} />

<div id="highlights" style="position: relative;">
	{#each highlights as highlight}
		<Highlight {highlight} />
	{/each}
	{#if isMouseDown}
		<Highlight
			highlight={{
				start: [cells.start[0], cells.start[1]],
				end: [mouse.x - gridRect.x, mouse.y - gridRect.y],
				rotation: getAngle(
					cells.start[0] * $CELL_WIDTH + $CELL_WIDTH / 2 + document.documentElement.scrollLeft,
					cells.start[1] * $CELL_WIDTH + $CELL_WIDTH / 2 + document.documentElement.scrollTop,
					mouse.x - gridRect.x,
					mouse.y - gridRect.y
				),
				color: $currentColor
			}}
			mouseHighlight
		/>
	{/if}
	{#if isTouchDown}
		<Highlight
			highlight={{
				start: [cells.start[0], cells.start[1]],
				end: [touch.x - gridRect.x, touch.y - gridRect.y],
				rotation: getAngle(
					cells.start[0] * $CELL_WIDTH + $CELL_WIDTH / 2 + document.documentElement.scrollLeft,
					cells.start[1] * $CELL_WIDTH + $CELL_WIDTH / 2 + document.documentElement.scrollTop,
					touch.x - gridRect.x,
					touch.y - gridRect.y
				),
				color: $currentColor
			}}
			mouseHighlight
		/>
	{/if}
</div>
