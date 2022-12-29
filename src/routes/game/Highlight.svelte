<script lang="ts">
	import { CELL_WIDTH } from '$lib/stores/game';
	import { calcDistance, calculateHighlightWidth } from '$lib/util';
	import { onDestroy } from 'svelte';

	export let highlight: { start: number[]; end: number[]; rotation: number; color: string };
	export let mouseHighlight = false;

	$: HIGHLIGHT_WIDTH = calculateHighlightWidth($CELL_WIDTH);

	onDestroy(() => {
		HIGHLIGHT_WIDTH = 0;
	});
</script>

<!-- svelte-ignore missing-declaration -->
<div
	class="current highlight"
	style="
				position: absolute;
				width: 10px;
				height: 10px;
				opacity: 1;
				z-index:1;
				"
	style:background-color={highlight.color}
	style:height="{HIGHLIGHT_WIDTH}px"
	style:border-radius="{HIGHLIGHT_WIDTH / 2}px {HIGHLIGHT_WIDTH / 2}px"
	style:width="{calcDistance(
		{
			x:
				highlight.start[0] * $CELL_WIDTH +
				$CELL_WIDTH / 2 +
				(mouseHighlight ? document.documentElement.scrollLeft : 0),
			y:
				highlight.start[1] * $CELL_WIDTH +
				$CELL_WIDTH / 2 +
				(mouseHighlight ? document.documentElement.scrollTop : 0)
		},
		{
			x: !mouseHighlight ? highlight.end[0] * $CELL_WIDTH + $CELL_WIDTH / 2 : highlight.end[0],
			y: !mouseHighlight ? highlight.end[1] * $CELL_WIDTH + $CELL_WIDTH / 2 : highlight.end[1]
		}
	) + HIGHLIGHT_WIDTH}px"
	style:transform-origin="{HIGHLIGHT_WIDTH / 2}px 50%"
	style:top="{highlight.start[1] * $CELL_WIDTH + $CELL_WIDTH / 2}px"
	style:left="{highlight.start[0] * $CELL_WIDTH + $CELL_WIDTH / 2}px"
	style:transform="translate(-{HIGHLIGHT_WIDTH / 2}px, -{HIGHLIGHT_WIDTH / 2}px) rotate({highlight.rotation}deg)"
/>
