<script lang="ts">
	import type { Cells } from '$lib/types';
	import { CELL_WIDTH, game } from '$lib/stores/game';
	import { strCoordToArray } from '$lib/util';

	export let coord: [number, number];
	export let validateAnswer = false;
	export let cells: Cells;
	export let isMouseDown: boolean;
	export let isTouchDown: boolean;
	export let coords: number[][];

	// Mouse events
	const onMouseDown = (event: MouseEvent & { currentTarget: HTMLSpanElement }) => {
		if ($game.hasEnded) return;

		const targetElement = event.currentTarget;

		cells.start = strCoordToArray(targetElement?.dataset?.coord as string).map((coord) =>
			Number(coord)
		);

		isMouseDown = true;
	};

	const onMouseUp = (event: MouseEvent & { currentTarget: HTMLSpanElement }) => {
		if ($game.hasEnded) return;

		const targetElement = event.currentTarget;

		cells.end = strCoordToArray(targetElement?.dataset.coord as string).map((coord) =>
			Number(coord)
		);

		// check user answer
		validateAnswer = true;

		isMouseDown = false;
	};

	// for touch screens
	const onTouchStart = (e: TouchEvent & { currentTarget: HTMLSpanElement }) => {
		if ($game.hasEnded) return;

		const targetElement = e.currentTarget;

		cells.start = strCoordToArray(targetElement?.dataset?.coord as string).map((coord) =>
			Number(coord)
		);

		isTouchDown = true;
	};

	const onTouchEnd = (e: TouchEvent & { currentTarget: HTMLSpanElement }) => {
		if ($game.hasEnded) return;

		const VALID_TOUCH_ELEMENT = 'SPAN';
		const lastTouched = e.changedTouches[e.changedTouches.length - 1];
		const position = {
			x: lastTouched.pageX,
			y: lastTouched.pageY - document.documentElement.scrollTop
		};
		const targetElement = document.elementFromPoint(position.x, position.y) as HTMLSpanElement;

		if (targetElement.tagName !== VALID_TOUCH_ELEMENT) {
			// reset cells
			cells = { start: [], end: [] };
			return;
		}
		cells.end = strCoordToArray(targetElement?.dataset?.coord as string).map((coord) =>
			Number(coord)
		);

		validateAnswer = true;
		isTouchDown = false;
	};

	$: found = coords.filter((n) => n[0] === coord[0] && n[1] === coord[1]).length > 0;
</script>

<span
	style:height="{$CELL_WIDTH}px"
	style:width="{$CELL_WIDTH}px"
	on:mousedown={onMouseDown}
	on:mouseup={onMouseUp}
	on:touchstart={onTouchStart}
	on:touchend|nonpassive={onTouchEnd}
	data-coord={coord}
	class="flex items-center justify-center z-10 box-border select-none uppercase font-normal
	{found ? 'text-slate-50' : 'text-slate-800 dark:text-slate-300'}
	"
>
	<slot />
</span>

<style>
	span {
		touch-action: none;
	}
</style>
