<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Game } from '$lib/types';

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

<main>
	<h1>Cipta permainan</h1>

	<form on:submit={handleSubmit}>
		<label class="input-group" for="title">
			<span>Tajuk</span>
			<input bind:value={game.title} type="text" id="title" placeholder="Title" />
		</label>
		<label for="words" class="input-group">
			<span>Jumlah perkataan</span>
			<input bind:value={totalWords} type="number" id="words" />
		</label>

		<hr />
		<span>Grid</span>

		<div class="input-group">
			<label for="rows">
				<span>Baris</span>
				<input bind:value={game.grid.rows} type="number" id="rows" />
			</label>
			<label for="columns">
				<span>Lajur</span>
				<input bind:value={game.grid.columns} type="number" id="columns" />
			</label>
		</div>

		<div class="input-group">
			<button type="submit">Cipta</button>
		</div>
	</form>
</main>
