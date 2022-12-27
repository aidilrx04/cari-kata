<script lang="ts">
	export let ctaHref = '#';
	export let ctaLabel = 'MAIN';
</script>

<div
	class="mode-card w-full w-max-xs sm:max-w-[250px] md:max-w-[300px] mx-auto p-3 h-auto bg-gray-50 rounded-md shadow-md my-4"
>
	<div class="title font-semibold text-center text-xl mb-2">
		<slot name="title" />
	</div>
	<div class="description text-xs my-3">
		<slot name="description" />
	</div>
	<div class="call-to-action my-3 mt-5">
		<a
			href={ctaHref}
			class="bg-violet-600 text-gray-50 block mx-5 px-2 py-1 text-lg text-center rounded shadow-md hover:bg-violet-700"
			>{ctaLabel}</a
		>
	</div>
</div>
