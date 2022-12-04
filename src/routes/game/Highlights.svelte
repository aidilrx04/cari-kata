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
		<div style:z-index="2">
			<Highlight
				highlight={{
					start: $cells.start,
					end: [mouse.x - $gridRect.x, mouse.y - $gridRect.y],
					rotation: getAngle(
						$cells.start[0] * $CELL_WIDTH + $CELL_WIDTH / 2,
						$cells.start[1] * $CELL_WIDTH + $CELL_WIDTH / 2,
						mouse.x - $gridRect.x,
						mouse.y - $gridRect.y
					),
					color: $currentColor
				}}
				mouseHighlight
			/>
		</div>
	{/if}
</div>
