<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import { MODES } from '$lib/modes';
	import { finishTime, startTime, type } from '$lib/stores';
	import { onDestroy } from 'svelte';

	export let showModal = true;

	const MODES_STRING = {
		[MODES.EASY]: 'Mudah',
		[MODES.HARD]: 'SUKAR',
		[MODES.NORMAL]: 'SEDERHANA'
	};

	onDestroy(() => {
		showModal = false;
	});

	const modeColor = ['text-cyan-500', 'text-blue-500', 'text-red-500'];

	const distance = ($finishTime as Date).getTime() - ($startTime as Date).getTime();
	const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((distance % (1000 * 60)) / 1000);
</script>

<div class="finish-modal">
	{#if showModal}
		<Modal
			on:close={() => {
				showModal = false;
			}}
			_class="bg-gray-50 shadow-md p-3 rounded-lg"
			transitionProps={{
				out: {
					duration: 0
				}
			}}
		>
			<div class="header text-2xl text-slate-900 my-2 text-center" slot="header">Selesai</div>
			<div class="py-3 my-3">
				<p class="finish-message text-slate-800 text-center text-md">
					Anda telah menyelesaikan cabaran
					<br />
					<span class="{modeColor[$type?.type - 1]} text-xl uppercase"
						>{MODES_STRING[$type?.type]}</span
					>
					<br />
					dalam masa
					<br />

					{#if minutes > 0}
						<span class="text-teal-500 text-lg"><span class="text-2xl">{minutes}</span> minit</span>
					{/if}
					<span class="text-orange-500 text-lg"><span class="text-xl">{seconds}</span> saat</span>
				</p>
			</div>
			<div slot="footer" class="border-t-2 border-t-gray-200 py-2 flex justify-center items-end ">
				<a
					href="/mode"
					class="w-full block py-2 px-3 rounded-lg bg-violet-700 text-gray-50 text-lg mx-1 my-2"
				>
					<i class="fas fa-refresh" />
					<span>Semula</span>
				</a>
				<button
					class="w-full block py-2 px-3 rounded-lg bg-gray-200 text-gray-800 text-lg mx-1 my-2"
					on:click={() => (showModal = false)}
				>
					<i class="fas fa-times" />
					<span>Tutup</span>
				</button>
			</div>
		</Modal>
	{/if}
</div>
