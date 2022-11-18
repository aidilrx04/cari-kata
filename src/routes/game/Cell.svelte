<script lang="ts">
	export let x: number;
	export let y: number;
	export let label: string;
</script>

<span data-coord={[x, y]} on:mousedown on:mouseup title="{x}, {y}">
	{label.trim() === '' ? '-' : label}
</span>

<style>
	span {
		user-select: none;
		z-index: 2;
		/* pointer-events: none; */
		display: inline-block;
		width: var(--width, 30px);
		min-width: var(--width, 30px);
		height: var(--height, 30px);
		display: grid;
		place-items: center;
		/* border: 1px solid gray; */
		box-sizing: border-box;
		cursor: pointer;
	}
</style>
