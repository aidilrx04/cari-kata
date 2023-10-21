<script lang="ts">
	import { slide } from 'svelte/transition';

	export let isOpen = false;
</script>

<div
	class="ck-accordion-content box-border bg-slate-100 dark:bg-slate-500 text-slate-800 dark:text-slate-50"
>
	{#if isOpen}
		<div class="p-3" transition:slide={{ duration: 150 }}>
			<slot><!-- optional fallback --></slot>
		</div>
	{/if}
</div>
