<script lang="ts">
	import Cell from './Cell.svelte';

	export let row: string[];
	export let rowCount: number;
</script>

<div class="row">
	{#each row as cell, j}
		<Cell x={j} y={rowCount} label={cell} on:mousedown on:mouseup />
	{/each}
</div>

<style>
	.row {
		display: flex;
		align-items: center;
		/* justify-content: center; */
	}
</style>
