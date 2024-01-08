<script lang="ts">
	import { currentColor } from '$lib/colors';
	import type {
		CalcHighlightWidth,
		Coord,
		HighlightData,
		HighlightUpdate,
		OnCellMoveFunction,
		Solved
	} from '$lib/types';
	import { getAngle, getCoordFromString, isValidCellElement } from '$lib/util';
	import { cellWidth, isPressing, startCoord } from './CellsManager.svelte';
	import Highlight, { calculateDistance, calculateHighlightWidth } from './Highlight.svelte';

	export let solvedWords: Solved[];
	export let containerRect: DOMRect;

	// absolute position on screen
	let mouse: Coord;

	// angle of mouse from relative $startCoord position
	let mouseAngle: number;

	let mouseHighlightWidth: number = 0;

	// element that when mouse currently hover
	let hoverElement: HTMLElement | null = null;

	// current highlight use by mouse/touch
	let highlight: HighlightData = {
		id: 0,
		angle: 0,
		start: { x: 0, y: 0 },
		end: { x: 0, y: 0 },
		width: 0,
		color: 'blue'
	};

	// higlights data for manually added highlight
	let highlights: HighlightData[] = [];
	let id = 1;

	export let onCellMove: OnCellMoveFunction = () => {};

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

		highlight = {
			id: 0,
			angle: mouseAngle,
			width: mouseHighlightWidth,
			start: $startCoord,
			end: { x: 0, y: 0 },
			color: $currentColor
		};

		highlights = [highlight, ...highlights];
		handleCellMove();
		highlights = highlights.slice(1);
	}

	const getMouseLocation = (event: MouseEvent) => {
		mouse = {
			x: event.pageX,
			y: event.pageY
		};

		hoverElement = event.target as HTMLElement | null;
	};

	const handleTouchInput = (e: TouchEvent) => {
		const touchEl = e.touches[0];
		hoverElement = document.elementFromPoint(
			touchEl.clientX,
			touchEl.clientY
		) as HTMLElement | null;
		mouse = {
			x: touchEl.pageX,
			y: touchEl.pageY
		};
	};

	const handleCellMove = () => {
		if (!$startCoord) return;

		let currentCoord: Coord | null = null;

		if (hoverElement && isValidCellElement(hoverElement as HTMLElement)) {
			const coordStr = hoverElement.dataset?.coord;
			if (coordStr) {
				currentCoord = getCoordFromString(coordStr);
			}
		}

		onCellMove(
			$startCoord,
			currentCoord,
			{
				highlight,
				updateCurrentHighlight: updateCurrentHighlight,
				calcHighlightWidth: calcHighlightWidth
			},
			{
				highlights,
				addHighlight: addHighlight,
				updateHighlight: updateHighlight,
				removeHighlight
			}
		);
	};

	const addHighlight = (data: Omit<HighlightData, 'id'>) => {
		const toAdd = {
			id: id,
			...data
		};
		highlights = [...highlights, toAdd];
		id++;

		return toAdd;
	};
	const updateHighlight = (id: number, data: Partial<Omit<HighlightData, 'id'>>) => {
		const index = highlights.findIndex((i) => i.id === id);
		highlights[index] = { ...highlights[index], ...data };

		highlights = [...highlights];
	};

	const removeHighlight = (id: number) => {
		highlights = highlights.filter((i) => i.id !== id);
	};

	const calcHighlightWidth: CalcHighlightWidth = (start, end) => {
		return calculateHighlightWidth(start, end, $cellWidth);
	};
	const updateCurrentHighlight: HighlightUpdate = (data) => {
		highlight = { ...highlight, ...data };
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
	{#each highlights as highlight}
		<Highlight
			angle={highlight.angle}
			start={highlight.start}
			end={highlight.end}
			color={highlight.color}
			width={highlight.width}
		/>
	{/each}
	{#if $isPressing && $startCoord !== undefined}
		<Highlight
			angle={highlight.angle}
			start={highlight.start}
			end={{
				/* Ignored since the this used to calc width and width is overwrite */
				x: 0,
				y: 0
			}}
			width={highlight.width}
			color={highlight.color}
		/>
	{/if}
</div>
