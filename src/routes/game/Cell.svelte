<script lang="ts">
	import type { Coord } from '$lib/types';
	import { createEventDispatcher } from 'svelte';

	// coord of the cell on the grid
	export let coord: Coord;

	// indicate whether the cell has been found
	export let found: boolean = false;

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
</script>

<!-- 
	cant use the grid auto width property because of clunky adjustment on window resize and weird bugs
	on certain dimension 
-->
<span
	class="flex items-center justify-center select-none uppercase z-20"
	style:width="{width}px"
	style:height="{height}px"
	class:text-slate-50={found}
	on:mousedown={handleMouseDown}
	on:mouseup={handleMouseUp}
>
	<slot />
</span>

<style>
	span {
		touch-action: none;
	}
</style>
