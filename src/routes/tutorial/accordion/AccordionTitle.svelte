<script lang="ts">
	export let isOpen = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="ck-accordion-title px-3 py-4 text-xl bg-gray-50 flex justify-between items-center text-slate-800 cursor-pointer"
	on:click={() => {
		isOpen = !isOpen;
	}}
>
	<div class="title">
		<slot><!-- optional fallback --></slot>
	</div>
	<button class="toggler px-3 ">
		<i
			class="fas fa-angle-left transition-transform"
			style:transform={isOpen ? 'rotate(-90deg)' : 'rotate(0deg)'}
		/>
	</button>
</div>
