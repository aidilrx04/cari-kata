<script lang="ts">
	import type { Solved } from '$lib/types';

	export let words: string[]; // words in grid
	export let solvedWords: Solved[];

	const getBackgroundColor = (word: string, solvedWords: Solved[]) => {
		const color = solvedWords.find((solved) => solved.word === word)?.color ?? '';

		return color;
	};

	const isSolved = (word: string, solvedWords: Solved[]) => {
		const index = solvedWords.findIndex((solved) => solved.word === word);
		return index >= 0;
	};
</script>

<div
	id="words"
	class="
default: mt-2 py-3 place-content-center grid grid-cols-1 place-items-center gap-x-2 gap-y-1
small: sm:grid-cols-2
med: md:grid-cols-3
lar: lg:place-content-start lg:place-items-starts
"
>
	{#each words as word, i (word)}
		<div
			style:background-color={getBackgroundColor(word, solvedWords)}
			class="word px-3 py-1 mx-2 mb-1 uppercase {isSolved(word, solvedWords)
				? '!text-slate-50'
				: '!text-slate-700 dark:!text-slate-800'} bg-slate-200 dark:bg-slate-400 rounded-full text-sm w-full text-center text-ellipsis tabular-nums"
		>
			<span>
				{word}
			</span>
		</div>
	{/each}
</div>
