<script lang="ts">
	import { onDestroy } from 'svelte';

	export let ctaHref = '#';
	export let ctaLabel = 'MAIN';
	export let disabled = false;

	let isLoading = false;

	onDestroy(() => {
		isLoading = false;
	});
</script>

<div
	class="mode-card w-full w-max-xs sm:max-w-[250px] md:max-w-[300px] mx-auto p-3 h-auto bg-slate-50 dark:bg-slate-700 rounded-md shadow-md my-4"
>
	<div class="title font-semibold text-center text-xl mb-2">
		<slot name="title" />
	</div>
	<div class="description text-xs my-3">
		<slot name="description" />
	</div>
	<div class="call-to-action my-3 mt-5">
		<a
			on:click={() => {
				isLoading = true;
				disabled = true;
			}}
			href={ctaHref}
			class="bg-violet-600 !text-slate-50 block mx-5 px-2 py-1 text-lg text-center rounded shadow-md hover:bg-violet-700 {disabled
				? 'pointer-events-none bg-violet-400 hover:bg-violet-400'
				: ''}"
		>
			{#if isLoading}
				<i class="fas fa-spinner fa-spin mr-1" />
			{/if}
			{ctaLabel}
		</a>
	</div>
</div>
