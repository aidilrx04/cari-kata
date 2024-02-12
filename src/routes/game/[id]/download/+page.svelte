<script lang="ts">
	import type { Game } from '$lib/types';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let game: Game;
	$: game = data.game;

	$: console.log(game);
</script>

<main class="bg-slate-50 p-3 mt-5">
	<h1 class="text-slate-800 text-xl mb-6">Download {game.title}</h1>

	<section class="mb-9">
		<h2 class="text-slate-600 mb-2 uppercase text-sm font-semibold">Word Position</h2>
		<div class="input-group">
			<input type="radio" id="pos-top" value="top" />
			<label for="pos-top">Top</label>
		</div>
		<div class="input-group">
			<input type="radio" id="pos-left" value="left" />
			<label for="pos-left">Left</label>
		</div>
		<div class="input-group">
			<input type="radio" id="pos-right" value="right" />
			<label for="pos-right">Right</label>
		</div>
		<div class="input-group">
			<input type="radio" id="pos-bottom" value="bottom" />
			<label for="pos-bottom">Top</label>
		</div>
	</section>

	<section class="mb-9">
		<h2 class="text-slate-700 mb-2 uppercase text-sm font-semibold">Preview</h2>

		<!-- <PreviewGrid /> -->
	</section>
</main>

<style lang="scss">
	.input-group {
		@apply flex items-center justify-start gap-2;

		label {
			@apply text-slate-700;
		}
	}
</style>
