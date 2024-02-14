<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import { onDestroy } from 'svelte';

	export let showModal = true;
	export let duration: number;

	onDestroy(() => {
		showModal = false;
	});

	const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((duration % (1000 * 60)) / 1000);
</script>

<div class="finish-modal">
	{#if showModal}
		<Modal
			open={showModal}
			on:close={() => {
				showModal = false;
			}}
			class="bg-slate-50 dark:bg-slate-600 shadow-lg p-3 rounded-lg"
			transitionProps={{
				out: {
					duration: 0
				}
			}}
		>
			<div class="header text-2xl text-slate-900 dark:text-slate-50 my-2 text-center" slot="header">
				Selesai
			</div>
			<div class="py-3 my-3">
				<p class="finish-message text-slate-800 dark:text-slate-200 text-center text-md">
					Anda telah menyelesaikan cabaran
					<br />
					<span class="text-xl uppercase">Cari Kata</span>
					<br />
					dalam masa
					<br />

					{#if minutes > 0}
						<span class="text-teal-500 text-lg"><span class="text-2xl">{minutes}</span> minit</span>
					{/if}
					<span class="text-orange-500 text-lg"><span class="text-xl">{seconds}</span> saat</span>
				</p>
			</div>
			<div slot="footer" class="border-t-2 border-t-gray-200 py-2 flex justify-center items-end">
				<a
					href="/mode"
					class="w-full block py-2 px-3 rounded-lg bg-violet-700 !text-gray-50 text-md mx-1 my-2 text-center"
				>
					<i class="fas fa-refresh" />
					<span>Semula</span>
				</a>
				<button
					class="w-full block py-2 px-3 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 text-md mx-1 my-2 text-center"
					on:click={() => (showModal = false)}
				>
					<i class="fas fa-times" />
					<span>Tutup</span>
				</button>
			</div>
		</Modal>
	{/if}
</div>
