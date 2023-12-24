<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Game } from '$lib/types';
	import Grid from '../game/Grid.svelte';

	const game: Game = {
		title: 'Mudah',
		words: [],
		grid: {
			rows: 9,
			columns: 7,
			grid: [],
			solved: []
		},
		backwardProbability: 0.25
	};

	let totalWords = 9;

	const handleSubmit = () => {
		fetch('/create', {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'post',
			body: JSON.stringify({
				core: game,
				totalWords
			})
		})
			.then((res) => {
				return res.json();
			})
			.then((res) => {
				console.log(res);
				goto(`/game/${res.game.id}`);
			});
	};
</script>

<header>
	<h1 class="uppercase text-2xl text-center mt-6 mb-3 tracking-wider">Cipta permainan</h1>
</header>

<main class="p-3 max-w-full bg-slate-50 dark:bg-slate-700 rounded-lg">
	<form on:submit={handleSubmit}>
		<label class="input-group" for="title">
			<span>Tajuk</span>
			<input bind:value={game.title} type="text" id="title" placeholder="Title" />
		</label>
		<label for="words" class="input-group">
			<span>Jumlah perkataan</span>
			<input bind:value={totalWords} type="number" id="words" />
		</label>

		<div class="relative my-4 text-center">
			<hr class="z-10 absolute top-1/2 left-0 w-full" />
			<span class="relative px-4 bg-slate-50 z-20">Grid</span>
		</div>

		<div class="flex w-full gap-5">
			<label for="rows" class="input-group w-full">
				<span>Baris</span>
				<input bind:value={game.grid.rows} type="number" id="rows" />
			</label>
			<label for="columns" class="input-group w-full">
				<span>Lajur</span>
				<input bind:value={game.grid.columns} type="number" id="columns" />
			</label>
		</div>

		<div class="input-group">
			<button
				type="submit"
				class="block w-full py-3 px-2 rounded text-slate-50 bg-violet-600 hover:bg-violet-700 active:focus:bg-violet-800"
			>
				Cipta
			</button>
		</div>
	</form>
</main>

<style>
	.input-group {
		@apply block mb-4;
	}

	.input-group span {
		@apply block mb-2;
	}

	.input-group input,
	.input-group select {
		@apply block w-full py-3 px-2 bg-slate-50 rounded border  border-slate-200;
	}
</style>
