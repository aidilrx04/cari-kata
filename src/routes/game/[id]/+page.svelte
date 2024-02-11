<script lang="ts">
	import { browser } from '$app/environment';
	import Modal from '$lib/Modal.svelte';
	import Grid from '../Grid.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	$: game = data.game;

	$: console.log(data);

	let openModal: () => void;
</script>

<main>
	<h2>
		{game.title} Game
	</h2>
	<span>Username</span>
	<span>at</span>
	<span>{new Date(game?.created_at).toDateString()}</span>

	<div class="actions">
		<button>Play</button>
		<button on:click={openModal}>
			<i class="ph ph-share-network" />
		</button>
		<a href={`/game/${game.id}/download  `}>
			<i class="ph ph-download-simple" />
		</a>
	</div>

	<h2>Game Board</h2>
	<Grid
		options={{
			columns: 7,
			rows: 9,
			grid: [],
			solved: []
		}}
		words={[]}
	/>

	<a href="/create" class="create-new">New Game</a>
</main>

<Modal bind:openModal open={false}>
	<div slot="header">Share Game</div>
	<div class="content">
		<input type="text" value={browser ? window?.location.href : ''} />
		<button>
			<i class="ph ph-copy-simple" />
			<span>Copy</span>
		</button>
	</div>
	<div slot="footer" let:closeModal>
		<button on:click={closeModal}>Close</button>
	</div>
</Modal>
