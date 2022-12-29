<script lang="ts">
	import { foundWords, words } from '$lib/stores/game';
	import { onDestroy } from 'svelte';

	let found_words_string: string[] = [];
	$: found_words_string = $foundWords.map((found) => found.word.word);
	let colors: string[] = [];
	$: colors = $foundWords.map((found) => found.color);

	onDestroy(() => {
		found_words_string = [];
		colors = [];
	});
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
	{#each $words as word, i (word)}
		<div
			style:background-color={colors[found_words_string.indexOf(word.word)]}
			style:color={found_words_string.indexOf(word.word) >= 0 ? '#f9fafb' : '#1e293b'}
			class="word px-3 py-1 mx-2 mb-1 uppercase bg-slate-200 rounded-full text-sm w-full text-center text-ellipsis tabular-nums"
		>
			<span>
				{#if word.displayText}
					{#each word.displayText as char, j}
						{#if found_words_string.indexOf(word.word) >= 0}
							<span class="mr-[1px] text-center" class:underline={char === '_'}>
								{word.word[j]}
							</span>
						{:else}
							<span class="mr-[1px] text-center">
								{char}
							</span>
						{/if}
					{/each}
				{:else}
					{#each word.word as char}
						<span class="mr-[1px] text-center">
							{char}
						</span>
					{/each}
				{/if}

				<!-- {#each $displayTexts[i].split('') as char, j}
					{#if $foundWords.words.indexOf(word) >= 0}
						<span class:underline={char === '_'} class="mr-[1px]">
							{word[j]}
						</span>
					{:else}
						<span class="mr-[1px]">
							{char}
						</span>
					{/if}
				{/each} -->
			</span>
		</div>
	{/each}
</div>
