<script context="module" lang="ts">
	export type HighlightData = {
		id: number;
		angle: number;
		start: Coord;
		end: Coord;
		width: number;
		color: string;
	};
</script>

<script lang="ts">
	import { currentColor } from '$lib/colors';
	import type { Coord, Solved } from '$lib/types';
	import { getAngle } from '$lib/util';
	import { cellWidth, isPressing, startCoord } from './CellsManager.svelte';
	import Highlight, { calculateDistance } from './Highlight.svelte';

	export let solvedWords: Solved[];
	export let containerRect: DOMRect;

	// absolute position on screen
	let mouse: Coord;

	// angle of mouse from relative $startCoord position
	let mouseAngle: number;

	let mouseHighlightWidth: number = 0;

	$: if ($isPressing && mouse && $startCoord !== undefined && $cellWidth) {
		const { scrollLeft, scrollTop } = document.documentElement;

		// calculate the angle of the mouse from the start coord
		mouseAngle = getAngle(
			$startCoord.x * $cellWidth + $cellWidth / 2 + scrollLeft, // relative to container
			$startCoord.y * $cellWidth + $cellWidth / 2 + scrollTop, // relative to container
			mouse.x - containerRect.x, // subtract container pos x to make it relative to container
			mouse.y - containerRect.y // subtract container pos y to make it relative to container
		);

		// calculate the highlight mouse width
		mouseHighlightWidth = calculateDistance(
			{
				x: $startCoord.x * $cellWidth + $cellWidth / 2 + scrollLeft,
				y: $startCoord.y * $cellWidth + $cellWidth / 2 + scrollTop
			},
			// mouse coord relative to grid container
			{
				x: mouse.x - containerRect.x,
				y: mouse.y - containerRect.y
			}
		);
	}

	const getMouseLocation = (event: MouseEvent) => {
		mouse = {
			x: event.pageX,
			y: event.pageY
		};
	};

	const handleTouchInput = (e: TouchEvent) => {
		const touchEl = e.touches[0];
		mouse = {
			x: touchEl.pageX,
			y: touchEl.pageY
		};
	};
</script>

<svelte:window on:mousemove={getMouseLocation} />
<svelte:body on:touchmove={handleTouchInput} on:touchstart={handleTouchInput} />

<div class="highlights-container absolute w-full h-full">
	{#each solvedWords as solvedWord}
		<Highlight
			angle={solvedWord.angle}
			start={solvedWord.coords[0]}
			end={solvedWord.coords[solvedWord.coords.length - 1]}
			color={solvedWord.color}
		/>
	{/each}
	{#if $isPressing && $startCoord !== undefined}
		<Highlight
			angle={mouseAngle}
			start={$startCoord}
			end={{
				/* Ignored since the this used to calc width and width is overwrite */
				x: 0,
				y: 0
			}}
			width={mouseHighlightWidth}
			color={$currentColor}
		/>
	{/if}
</div>
