<script>
	import Grid from '../Grid.svelte';
</script>

<main>
	<h2>Title</h2>
	<span>Username</span>
	<span>at</span>
	<span>00/00/2000</span>

	<div class="actions">
		<button>Play</button>
		<button>
			<i class="ph ph-share-network" />
		</button>
		<button>
			<i class="ph ph-download-simple" />
		</button>
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

	<button class="create-new">New Game</button>
</main>
