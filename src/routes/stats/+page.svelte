<script lang="ts">
	import Footer from '$lib/Footer.svelte';
	import Navigation from '$lib/Navigation.svelte';
	import stats from '$lib/stores/stats';
	import ModeChart from './ModeChart.svelte';
</script>

<div id="stats" class="w-[360px] mx-auto">
	<header>
		<Navigation />
		<div class="titles px-3 my-3">
			<h1 class="text-2xl text-slate-800 uppercase tracking-wider">Statistik</h1>
			<small class="uppercase text-slate-600 text-xs">Anda sepanjang bermain</small>
		</div>
	</header>
	<main class="mx-3 p-3 bg-gray-50 rounded-lg">
		<div class="stats-cards flex justify-center gap-6 mt-3 mb-5">
			<div class="stat-card bg-violet-600">
				<i class="fas fa-play block text-6xl mt-3" />
				<span class="font-semibold text-xl text-center">{$stats.total}</span>
				<span class="font-normal uppercase text-center text-sm tracking-wide">permainan</span>
			</div>
			<div class="stat-card bg-green-500">
				<i class="fas fa-trophy block text-6xl mt-3" />
				<span class="font-semibold text-xl text-center">{$stats.win}</span>
				<span class="font-normal uppercase text-center text-sm tracking-wide">menang</span>
			</div>
		</div>
		<hr />
		<div class="game-charts my-3">
			<h2 class="text-xl uppercase tracking-wide mb-2 text-slate-800">Carta</h2>

			<div class="h-[250px] relative">
				{#if $stats.total > 0}
					<ModeChart stats={$stats} />
				{:else}
					<div
						class="w-full h-full bg-gray-100 flex items-center justify-center text-center rounded"
					>
						<p class="text-slate-700">
							Tiada statistik untuk carta.
							<br />
							Sila main beberapa permainan
						</p>
					</div>
				{/if}
			</div>
		</div>
	</main>
	<Footer />
</div>

<style>
	.stat-card {
		@apply rounded-3xl w-full py-2 px-3 text-center text-gray-50;
	}

	.stat-card span {
		@apply block;
	}
</style>
