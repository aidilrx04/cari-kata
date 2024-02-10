<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Game, OnSuccessPlacement, WordInGrid } from '$lib/types';
	import ConfirmCreateTab from './ConfirmCreateTab.svelte';
	import CreateGrid from './CreateGrid.svelte';
	import CreateWords from './CreateWords.svelte';

	const gridData = {
		rows: 9,
		columns: 7,
		grid: [],
		solved: []
	};

	const game: Game = {
		title: 'Mudah',
		words: [],
		grid: gridData,
		backwardProbability: 0.25
	};

	let solved: string[][];
	let grid: string[][];

	let placedWords: WordInGrid[] = [];
	let totalWords = 9;
	let words: string[] = ['hei', 'whatsup', 'gais', 'harini', 'kita', 'makan', 'sayur', 'berapi'];
	let selected: string = '';

	let currTab = 2;

	const handleSubmit = () => {
		fetch('/create', {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'post',
			body: JSON.stringify({
				core: {
					...game,
					words: placedWords,
					grid: {
						...gridData,
						solved,
						grid
					}
				},
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

	const handleSuccessPlacement: OnSuccessPlacement = (word, start, end) => {
		placedWords = [
			...placedWords,
			{
				value: word,
				display: word,
				start: start,
				end: end
			}
		];
		selected = '';
	};

	const changeTab = (tab: number) => {
		currTab = tab;
	};

	const nextTab = () => {
		changeTab(currTab + 1);
	};

	const prevTab = () => {
		changeTab(currTab - 1);
	};
</script>

<header>
	<h1 class="uppercase text-2xl text-center mt-6 mb-3 tracking-wider">Cipta permainan</h1>
</header>

<main id="create-game" class="p-3 max-w-full bg-slate-50 dark:bg-slate-700 rounded-lg">
	<form on:submit={handleSubmit} class="section-container w-full">
		<div id="section1" class="section">
			{#if currTab === 0}
				<div class="w-[360px] max-w-full mx-auto">
					<label class="input-group" for="title">
						<span>Tajuk</span>
						<input bind:value={game.title} type="text" id="title" placeholder="Title" />
					</label>
					<div class="input-group mt-6">
						<button
							on:click={() => {
								changeTab(1);
							}}
							type="button"
							class="next nav-btn">Next</button
						>
					</div>
				</div>
			{:else if currTab === 1}
				<style>
					main#create-game {
						@apply bg-transparent;
					}
				</style>
				<h2 class="mb-5 text-xl text-center">Game Generation</h2>

				<div class="">
					<CreateWords bind:words bind:selected bind:placedWords {nextTab} />
					<CreateGrid
						bind:rows={gridData.rows}
						bind:columns={gridData.columns}
						bind:grid
						bind:solved
						bind:selected
						bind:placedWords
						onSuccessPlacement={handleSuccessPlacement}
						showGrid={false}
					/>
				</div>
				<!-- <div class="input-group !flex gap-2">
					<button
						on:click={() => {
							changeTab(0);
						}}
						type="button"
						class="prev nav-btn">Back</button
					>
					<button
						on:click={() => {
							changeTab(2);
						}}
						type="button"
						class="next nav-btn">Next</button
					>
				</div> -->
			{:else if currTab === 2}
				<ConfirmCreateTab
					title={game.title}
					words={placedWords}
					game={{
						rows: gridData.rows,
						columns: gridData.columns,
						solved: solved,
						grid: grid
					}}
					{prevTab}
				/>
			{/if}
		</div>
	</form>
</main>

<style lang="scss">
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

	.section-container {
		.section {
			@apply min-w-full;

			:global(.nav-btn) {
				@apply block py-2 px-3 text-center w-full rounded;

				&.next {
					@apply bg-violet-600 text-slate-50;

					&:hover {
						@apply bg-violet-700;
					}
				}
				&.prev {
					@apply text-slate-600 bg-slate-100;

					&:hover {
						@apply bg-slate-200;
					}
				}
			}

			.radio-input {
				@apply flex items-center justify-start gap-2;

				[type='radio'] {
					@apply w-auto;
				}

				span {
					@apply mb-0;
				}
			}
		}
	}
</style>
