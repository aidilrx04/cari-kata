<script lang="ts">
	import type { Coord } from '$lib/types';
	import { createEventDispatcher } from 'svelte';

	// coord of the cell on the grid
	export let coord: Coord;

	// indicate whether the cell is active
	// active is when cell is within a highlight
	export let active: boolean = false;

	// cell dimension
	export let width: number;
	export let height: number;

	const dispatcher = createEventDispatcher<{
		pressedOn: { coord: typeof coord };
		releasedOn: { coord: typeof coord };
		size: { height: number };
	}>();

	const handleMouseDown = () => {
		dispatcher('pressedOn', {
			coord
		});
	};

	const handleMouseUp = () => {
		dispatcher('releasedOn', { coord });
	};

	const handleTouchStart = () => {
		dispatcher('pressedOn', { coord });
	};
</script>

<!-- Add ability to add outline/border to cell without overlaying the highlight -->
<span class="cell-container">
	<!-- 
		cant use the grid auto width property because of clunky adjustment on window resize and weird bugs
		on certain dimension 
	-->
	<span
		class="cell relative flex items-center justify-center select-none uppercase z-20"
		style:width="{width}px"
		style:height="{height}px"
		class:active
		data-coord={[coord.x, coord.y]}
		on:mousedown={handleMouseDown}
		on:mouseup={handleMouseUp}
		on:touchstart={handleTouchStart}
	>
		<slot />
	</span>
</span>

<style>
	span {
		touch-action: none;
	}

	.cell.active {
		@apply text-slate-50;
	}
</style>
