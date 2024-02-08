<script lang="ts">
	import type { GridOptions, WordInGrid } from '$lib/types';
	import CreateGrid from './CreateGrid.svelte';

	export let title: string;
	export let words: WordInGrid[];

	export let game: GridOptions;

	export let prevTab: () => void;
</script>

<h2 class="text-2xl mb-6 text-slate-700">Create Confirmation</h2>

<div class="subject-group">
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label class="label-title">Title</label>
	<span class="text-slate-800">{title}</span>
</div>

<div class="subject-group">
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label class="label-title">Words</label>
	<ul class="flex items-center justify-start gap-3">
		{#each words as word}
			<li class="rounded-full bg-slate-200 text-slate-700 px-5 py-1">{word.value}</li>
		{/each}
	</ul>
</div>
<div class="subject-group">
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label class="label-title">Preview</label>
	<CreateGrid
		columns={game.columns}
		rows={game.rows}
		placedWords={words}
		grid={game.grid}
		solved={game.solved}
	/>
</div>

<div class="input-group !flex gap-2">
	<button on:click={prevTab} type="button" class="prev nav-btn">Back</button>
	<button
		type="submit"
		class="block w-full py-3 px-2 rounded text-slate-50 bg-violet-600 hover:bg-violet-700 active:focus:bg-violet-800"
	>
		Cipta
	</button>
</div>

<style>
	.subject-group {
		@apply mb-5;
	}
	.label-title {
		@apply text-slate-600 font-semibold text-sm block mb-2;
	}
</style>
