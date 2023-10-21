<script lang="ts">
	import AccordionContent from './AccordionContent.svelte';
	import AccordionTitle from './AccordionTitle.svelte';

	export let isOpen = false;
</script>

<div class="ck-accordion-item border-t border-slate-200 dark:border-slate-500 first:border-t-0">
	<AccordionTitle bind:isOpen>
		<slot name="title"><!-- optional fallback --></slot>
	</AccordionTitle>
	{#if isOpen}
		<div class="w-full h-0 border-b-2 border-slate-200 dark:border-slate-500" />
	{/if}
	<AccordionContent bind:isOpen>
		<slot name="content"><!-- optional fallback --></slot>
	</AccordionContent>
</div>
