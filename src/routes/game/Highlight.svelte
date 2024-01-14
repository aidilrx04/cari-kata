<script lang="ts" context="module">
	export const calculateDistance = (start: Coord, end: Coord) => {
		const xLength = end.x - start.x;
		const yLength = end.y - start.y;
		const hipotenus = Math.sqrt(Math.pow(xLength, 2) + Math.pow(yLength, 2));
		return hipotenus;
	};

	export const calculateHighlightWidth = (start: Coord, end: Coord, cellWidth: number) => {
		// calculate the distance from the center of the start coord to the center of end coord
		const scaledStartCoord = {
			x: start.x * cellWidth + cellWidth / 2,
			y: start.y * cellWidth + cellWidth / 2
		};
		const scaledEndCoord = {
			x: end.x * cellWidth + cellWidth / 2,
			y: end.y * cellWidth + cellWidth / 2
		};
		const distance = calculateDistance(scaledStartCoord, scaledEndCoord);

		return distance;
	};
</script>

<script lang="ts">
	import type { Coord } from '$lib/types';
	import { cellHeight, cellWidth } from './CellsManager.svelte';

	// angle of rotation
	export let angle: number;
	export let start: Coord;
	export let end: Coord;
	export let color: string = '#8b5cf6';

	export let outline: string | undefined = undefined;

	// overwrite the default calculateHighlightWidth result if provided
	export let width: number | undefined = undefined;

	// absolute width to use either default or overwrited one
	$: absoluteWidth = width !== undefined ? width : calculateHighlightWidth(start, end, $cellWidth);

	let position: Coord; // highlight absolute position
	// $: position = calculateHighlightPosition(start, $cellWidth);
	$: if (start && $cellWidth) {
		position = calculateHighlightPosition(start, $cellWidth);
	}

	$: height = ($cellHeight * 80) / 100;
	$: halfHeight = height / 2;

	// calculate the position based on coord and cell width
	const calculateHighlightPosition = (start: Coord, width: number): Coord => {
		const left = start.x * width + width / 2;
		const top = start.y * width + width / 2;

		return {
			x: left,
			y: top
		};
	};
</script>

<div
	class="w-full absolute rounded-full z-10"
	style:background-color={color}
	style:width="{absoluteWidth + height}px"
	style:height="{height}px"
	style:top="{position.y}px"
	style:left="{position.x}px"
	style:transform="translate({-halfHeight}px, {-halfHeight}px) rotate({angle}deg)"
	style:transform-origin="{halfHeight}px 50%"
	style:outline
/>
