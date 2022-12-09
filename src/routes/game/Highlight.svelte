<script lang="ts">
	import { CELL_WIDTH, HIGHLIGHT } from '$lib/stores';
	import { calcDistance } from '$lib/util';

	export let highlight: { start: number[]; end: number[]; rotation: number; color: string };
	export let mouseHighlight = false;
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
	style:height="{$HIGHLIGHT}px"
	style:border-radius="{$HIGHLIGHT / 2}px {$HIGHLIGHT / 2}px"
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
	) + $HIGHLIGHT}px"
	style:transform-origin="{$HIGHLIGHT / 2}px 50%"
	style:top="{highlight.start[1] * $CELL_WIDTH + $CELL_WIDTH / 2}px"
	style:left="{highlight.start[0] * $CELL_WIDTH + $CELL_WIDTH / 2}px"
	style:transform="translate(-{$HIGHLIGHT / 2}px, -{$HIGHLIGHT / 2}px) rotate({highlight.rotation}deg)"
/>
