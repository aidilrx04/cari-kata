<script lang="ts">
	import type { DisplayWordFunction, Solved, Word } from '$lib/types';

	export let words: Word[]; // words in grid
	export let solvedWords: Solved[];

	const displayWord: DisplayWordFunction = (word: Word, solvedWords: Solved[]) => {
		const solved = isSolved(word.value, solvedWords);

		return [...word.display.replaceAll(' ', '?')]
			.map((letter, i) => {
				const same = letter === word.value[i];

				return /*html*/ `
			<span class="text-center px-px
			relative
			w-[1em]
			${
				!same
					? 'after:absolute after:top-0 after:left-0 after:w-full after:h-full after:border-b-2  after:border-slate-600'
					: ''
			}
			${!same && !solved ? 'text-transparent' : 'after:!border-slate-50'}
			">
				${solved ? word.value[i] : letter}
			</span>
			`;
			})
			.join('');
	};

	const getBackgroundColor = (word: string, solvedWords: Solved[]) => {
		const color = solvedWords.find((solved) => solved.word.value === word)?.highlight.color ?? '';

		return color;
	};

	const isSolved = (word: string, solvedWords: Solved[]) => {
		const index = solvedWords.findIndex((solved) => solved.word.value === word);
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
			style:background-color={getBackgroundColor(word.value, solvedWords)}
			class="word px-3 py-1 mx-2 mb-1 uppercase {isSolved(word.value, solvedWords)
				? '!text-slate-50'
				: '!text-slate-700 dark:!text-slate-800'} bg-slate-200 dark:bg-slate-400 rounded-full text-sm w-full text-center text-ellipsis tabular-nums"
		>
			<span class="flex gap-x-[2px] gap-y-1 justify-center items-center flex-wrap">
				{@html displayWord(word, solvedWords)}
			</span>
		</div>
	{/each}
</div>
