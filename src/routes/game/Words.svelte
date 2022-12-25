<script lang="ts">
	import { foundWords, words } from '$lib/stores';
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
	{#each $words as word (word)}
		<div
			style:background-color={$foundWords.colors[$foundWords.words.indexOf(word)]}
			style:color={$foundWords.words.indexOf(word) >= 0 ? '#f9fafb' : '#1e293b'}
			class="word px-3 py-1 mx-2 mb-1 uppercase bg-slate-200 rounded-full text-sm w-full text-center text-ellipsis"
		>
			{word}
		</div>
	{/each}
</div>
