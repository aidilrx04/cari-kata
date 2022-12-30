<script lang="ts">
	import { slide } from 'svelte/transition';

	export let isOpen = false;
</script>

<div class="ck-accordion-content box-border bg-gray-100 text-gray-800">
	{#if isOpen}
		<div class="p-3" transition:slide={{ duration: 150 }}>
			<slot><!-- optional fallback --></slot>
		</div>
	{/if}
</div>
