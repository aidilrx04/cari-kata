<script lang="ts">
	import { browser } from '$app/environment';
	import Modal from '$lib/components/Modal.svelte';
	import Board from '$lib/components/Board.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	$: game = data.game;

	$: console.log(data);

	let openModal: () => void;
	let hasTextCopied = false;
</script>

<main id="game" class="p-3 mt-5 bg-slate-50 rounded-lg max-w-full">
	<h2 class="text-xl text-slate-800 mb-2">
		{game.title} Game
	</h2>
	<div class="flex items-center justify-start gap-3 mb-6">
		<span class="text-sm font-semibold text-slate-700">Username</span>
		<span class="text-sm text-slate-500">at</span>
		<span class="text-sm text-slate-700">{new Date(game?.created_at).toDateString()}</span>
	</div>

	<div class="actions flex items-center gap-2 mb-10">
		<button class="bg-emerald-500 text-slate-50 rounded uppercase px-4 py-3 flex-1">Play</button>
		<button
			on:click={openModal}
			class="text-slate-700 bg-slate-200 px-3 py-2 rounded cursor-pointer"
		>
			<i class="ph ph-share-network text-2xl" />
		</button>
		<a
			href={`/game/${game.id}/download`}
			class="text-slate-700 bg-slate-200 px-3 py-2 rounded cursor-pointer"
		>
			<i class="ph ph-download-simple text-2xl" />
		</a>
	</div>

	<h2 class="text-slate-600 text-sm font-semibold mb-3">Game Board</h2>
	<Board grid={game.grid.grid} columns={game.grid.columns} rows={game.grid.rows} />

	<a
		href="/create"
		class="create-new block text-center text-slate-700 w-full px-4 py-3 uppercase border rounded border-slate-400 font-semibold"
	>
		New Game
	</a>
</main>

<Modal bind:openModal open={false}>
	<div slot="header" class="mb-3 text-2xl text-slate-700">Share Game</div>
	<div class="content">
		<div class="flex w-full max-w-full overflow-hidden rounded border border-slate-300">
			<input
				value={browser ? window.location.href : ''}
				class="min-w-0 bg-slate-200 text-slate-700 text-ellipsis px-3 py-2"
			/>
			<button
				on:click={() => {
					navigator.clipboard
						.writeText(window.location.href)
						.then(() => {
							console.log('text copied');
							hasTextCopied = true;
						})
						.catch(() => {
							console.log('text copy failed');
						});
				}}
				class=" bg-slate-50 text-slate-700 px-3 py-2 flex items-center justify-start gap-2"
			>
				<i class="ph ph-copy-simple text-2xl" />
				<span>{hasTextCopied ? 'Copied!' : 'Copy'}</span>
			</button>
		</div>
	</div>
	<div slot="footer" let:closeModal class="flex items-center justify-end mt-6">
		<button class="block px-3 py-2 text-slate-600 uppercase" on:click={closeModal}>Close</button>
	</div>
</Modal>
