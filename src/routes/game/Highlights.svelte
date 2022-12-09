<script lang="ts">
	import {
		cells,
		CELL_WIDTH,
		gridRect,
		HIGHLIGHT,
		highlights,
		isMouseDown,
		currentColor
	} from '$lib/stores';
	import { getAngle } from '$lib/util';
	import Highlight from './Highlight.svelte';

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
</script>

<svelte:window on:mousemove={setMousePosition} />
<div id="highlights" style="position: relative;">
	{#each $highlights as highlight}
		<Highlight {highlight} />
	{/each}
	{#if $isMouseDown}
		<Highlight
			highlight={{
				start: [$cells.start[0], $cells.start[1]],
				end: [mouse.x - $gridRect.x, mouse.y - $gridRect.y],
				rotation: getAngle(
					$cells.start[0] * $CELL_WIDTH + $CELL_WIDTH / 2 + document.documentElement.scrollLeft,
					$cells.start[1] * $CELL_WIDTH + $CELL_WIDTH / 2 + document.documentElement.scrollTop,
					mouse.x - $gridRect.x,
					mouse.y - $gridRect.y
				),
				color: $currentColor
			}}
			mouseHighlight
		/>
	{/if}
</div>
