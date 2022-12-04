<script lang="ts">
	import { CELL_WIDTH, cells, isMouseDown, validateAnswer, foundWords } from '$lib/stores';
	import { strCoordToArray } from '$lib/util';

	export let coord: [number, number];

	// Mouse events
	const onMouseDown = (event: MouseEvent & { currentTarget: HTMLSpanElement }) => {
		const targetElement = event.currentTarget;

		$cells.start = strCoordToArray(targetElement?.dataset?.coord as string).map((coord) =>
			Number(coord)
		);

		$isMouseDown = true;
	};

	const onMouseUp = (event: MouseEvent & { currentTarget: HTMLSpanElement }) => {
		const targetElement = event.currentTarget;

		$cells.end = strCoordToArray(targetElement?.dataset.coord as string).map((coord) =>
			Number(coord)
		);

		// check user answer
		$validateAnswer = true;

		$isMouseDown = false;
	};
</script>

<span
	style:height="{$CELL_WIDTH}px"
	style:width="{$CELL_WIDTH}px"
	on:mousedown={onMouseDown}
	on:mouseup={onMouseUp}
	data-coord={coord}
	style:color={$foundWords.coords.filter((n) => n[0] === coord[0] && n[1] === coord[1]).length > 0
		? 'white'
		: 'black'}
	class="flex items-center justify-center z-10 box-border select-none uppercase font-normal"
>
	<slot />
</span>

<style>
	span {
		/* user-select: none;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 2;
		border: 1px solid lightgray;
		border-collapse: collapse;
		box-sizing: border-box; */
	}
</style>
