<script lang="ts">
	export let words: string[] = [];
	let word = '';
	export let selected: string;

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
</script>

Words
<div>
	<ul>
		{#each words as word}
			<button
				on:click={() => {
					selected = word;
				}}
				type="button"
			>
				{word}
			</button>,
		{/each}
	</ul>
</div>
<input type="text" bind:value={word} />
<button
	type="button"
	on:click={() => {
		words = [...words, word];
		word = '';
	}}>+ Add Word</button
>
<button on:click={get10Words} type="button">Get 10 Words</button>

<br />
{#if selected}
	{#each [...selected] as char}
		<span class="px-4 uppercase">{char}</span>
	{/each}
{/if}
