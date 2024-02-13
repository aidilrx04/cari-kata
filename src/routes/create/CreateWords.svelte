<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import { currentColor } from '$lib/colors';
	import type { WordInGrid } from '$lib/types';
	import { fly } from 'svelte/transition';

	export let words: string[] = [];
	let word = '';
	export let selected: string;

	export let placedWords: WordInGrid[];

	$: unplacedWords = words.filter((word) => !placedWords.find((placed) => placed.value === word));

	let isAddWord = false;

	let isOpen = false;

	let openModal: () => void;
	let closeModal: () => void;
	export let nextTab: () => void;

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

<!-- TODO: Build Structure for this feature first, then style it -->
<div class="w-full fixed bottom-0 left-0 p-4 bg-slate-50 rounded-t z-30">
	<div class="actions absolute right-5 bottom-full pb-5 flex flex-col gap-2">
		<button
			on:click={() => {
				openModal();
			}}
			class="w-12 h-12 cursor-pointer rounded-full bg-blue-600 text-slate-50"
			type="button"
		>
			<i class="ph ph-plus text-2xl" />
		</button>
		<button class="w-12 h-12 cursor-pointer rounded-full bg-slate-300 text-slate-600" type="button">
			<i class="ph ph-dots-three text-2xl" />
		</button>
		<button
			on:click={() => {
				nextTab();
			}}
			class="w-12 h-12 cursor-pointer rounded-full bg-violet-600 text-slate-50"
			type="button"
		>
			<i class="ph ph-check text-2xl" />
		</button>
	</div>
	<button
		type="button"
		on:click={() => {
			isOpen = !isOpen;
		}}
		class="w-24 h-6 flex items-center justify-center absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-50 rounded-t"
	>
		<i class="ph ph-minus text-2xl text-slate-400" />
	</button>
	<div class="not-placed-words">
		{#if isOpen}
			<h4 class="uppercase text-slate-600 mb-3 text-sm">Not Placed</h4>
		{/if}
		<div class="not-placed-words p-2 flex gap-2 w-full overflow-x-auto {isOpen ? 'flex-wrap' : ''}">
			{#each unplacedWords as word}
				<button
					class="block px-3 py-2 rounded text-slate-600
					{word === selected ? 'text-slate-700 font-semibold outline outline-2 outline-violet-600' : ''}
					"
					type="button"
					on:click={() => {
						selected = word;
					}}
				>
					{word}
				</button>
				<div class="divider border-l" />
			{/each}
		</div>
	</div>
	{#if isOpen}
		<div class="placed-words mt-11 mb-6">
			<h4 class="uppercase text-slate-600 mb-3 text-sm">Placed</h4>
			<div class="flex gap-2 flex-wrap">
				{#each placedWords as word}
					<button class="px-4 py-2 bg-violet-600 text-slate-50 rounded" type="button">
						{word.value}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

<Modal bind:openModal bind:closeModal>
	<div slot="header">
		<h5 class="mb-3 text-xl text-slate-700">Add Word</h5>
	</div>
	<div class="content mb-6">
		<input
			bind:value={word}
			type="text"
			class="text-slate-700 bg-slate-200 border-b rounded border-b-slate-600 py-2 px-3"
		/>
	</div>
	<div slot="footer" class="flex items-center justify-end gap-3">
		<button
			on:click={closeModal}
			class="px-3 py-2 bg-slate-50 text-slate-600 text-sm"
			type="button"
		>
			Cancel
		</button>
		<button
			on:click={() => {
				addWord();
				closeModal();
			}}
			class="px-3 py-2 bg-violet-600 text-slate-50 rounded text-sm font-semibold"
			type="button"
		>
			Add
		</button>
	</div>
</Modal>

<!-- <div class={selected !== undefined ? 'py-5 mb-5' : ''}>
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
		</div> -->
<!-- <ul class="grid grid-cols-2 gap-1">
			{#each words as word (word)}
				<button
					on:click={() => {
						selected = word;
					}}
					type="button"
					class="word-btn group relative
					{hasPlaced(word, placedWords) ? '!border-violet-600 !border-2' : 'shadow-sm'}
					{word === selected ? 'outline-violet-200 outline-4 outline' : ''}"
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
		</ul> -->

<style lang="postcss">
	.word-btn {
		@apply block w-full rounded py-3 px-2 border text-slate-700 cursor-pointer  border-slate-200;
	}

	.word-btn:hover {
		@apply bg-slate-100;
	}
</style>
