<script lang="ts">
	import { currentColor } from '$lib/colors';
	import type { WordInGrid } from '$lib/types';
	import { fly } from 'svelte/transition';

	export let words: string[] = [];
	let word = '';
	export let selected: string;

	export let placedWords: WordInGrid[];

	let isAddWord = false;

	const get10Words = () => {
		fetch('https://bahasa-api.vercel.app/api/word?amount=10', {
			headers: {
				Accept: 'application/json'
			}
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				words = [
					...words,
					...data.map((word) => word.word).reduce((acc, word) => [...acc, word], [])
				];
			});
	};

	const addWord = () => {
		words = [...words, word];
		word = '';
	};

	const hasPlaced = (word: string, placed: WordInGrid[]): boolean => {
		return placed.findIndex((i) => i.value === word) >= 0;
	};

	const deleteWord = (word: string) => {
		if (hasPlaced(word, placedWords)) {
			const y = confirm(
				'This word has already placed in the grid. Deleting this will result deleting the word placed in grid to be removed as well'
			);

			if (!y) return;

			deletePlacedWord(word);
		}

		words = words.filter((w) => w !== word);
	};

	const deletePlacedWord = (word: string) => {
		// remove placed word
		placedWords = placedWords.filter((i) => i.value !== word);
	};
</script>

<div class="w-full">
	<span class="font-semibold text-xl text-slate-800 mb-4 block">Words</span>
	<div class="words-container relative">
		<div class={selected !== undefined ? 'py-5 mb-5' : ''}>
			{#if selected}
				<div
					class="selected flex gap-4 absolute top-0 left-1/2 -translate-x-1/2 py-2 px-6 rounded-full text-slate-50 z-50"
					style:background-color={$currentColor}
					in:fly={{
						x: -50
					}}
					out:fly={{
						x: 50
					}}
				>
					{#each [...selected] as char}
						<span class="uppercase">{char}</span>
					{/each}
				</div>
			{:else}
				<div
					class="selected font-semibold uppercase flex gap-4 absolute top-0 left-1/2 -translate-x-1/2 py-2 px-6 rounded-full text-slate-400 bg-slate-200 z-50"
				>
					<span>W</span>
					<span>O</span>
					<span>R</span>
					<span>D</span>
				</div>
			{/if}
		</div>
		<ul class="grid grid-cols-2 gap-1">
			{#each words as word (word)}
				<button
					on:click={() => {
						selected = word;
					}}
					type="button"
					class="word-btn group relative
					{hasPlaced(word, placedWords) ? '!border-violet-600 !border-2' : 'shadow-sm'}"
				>
					<span>{word}</span>
					<div class="actions group-hover:block hidden absolute top-1/2 right-2 -translate-y-1/2">
						{#if hasPlaced(word, placedWords)}
							<button
								on:click={() => {
									deletePlacedWord(word);
								}}
								class="p-2"
								type="button"
							>
								<i class="ph ph-link-break" />
							</button>
						{/if}
						<button
							type="button"
							on:click|preventDefault={(e) => {
								deleteWord(word);
							}}
						>
							<i class="ph ph-trash" />
						</button>
					</div>
				</button>
			{/each}
			{#if !isAddWord}
				<button
					on:click={() => (isAddWord = true)}
					class="word-btn bg-violet-200 border-violet-400 hover:!bg-violet-300"
					type="button"
				>
					<i class="ph ph-plus" />
					<span>Add Word</span>
				</button>
			{:else}
				<div class="input-word col-span-2 flex gap-1 mt-4">
					<input
						type="text"
						bind:value={word}
						class="py-3 px-1 block w-full border border-slate-300 rounded bg-slate-50"
						autofocus={true}
						on:keydown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault();
								return false;
							}
						}}
						on:keyup|preventDefault={(e) => {
							if (e.key === 'Enter') {
								addWord();
								isAddWord = false;
								return false;
							}
						}}
					/>
					<button
						type="button"
						on:click={() => {
							addWord();
							isAddWord = false;
						}}
						class="px-3 py-2 flex items-center justify-center gap-2 font-semibold border border-violet-800 bg-violet-600 text-slate-50 rounded hover:bg-violet-800"
					>
						<i class="ph ph-plus" />
						<span>Add</span>
					</button>
				</div>
			{/if}

			<button
				class="word-btn bg-sky-100 border-sky-300 hover:!bg-sky-200"
				on:click={get10Words}
				type="button"
			>
				Get 10 Words
			</button>
		</ul>
	</div>
</div>

<style lang="postcss">
	.word-btn {
		@apply block w-full rounded py-3 px-2 border text-slate-700 cursor-pointer  border-slate-200;
	}

	.word-btn:hover {
		@apply bg-slate-100;
	}
</style>
