<script lang="ts">
	import stats from '$lib/stores/stats';
	import ModeChart from './ModeChart.svelte';

	const calculateAverage = (total_time: number, total: number) => {
		const average = total_time / total;

		const minutes = Math.floor((average % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((average % (1000 * 60)) / 1000);

		return {
			minutes,
			seconds
		};
	};

	let averageTime;

	$: if ($stats.win > 0 && $stats.total_time > 0)
		averageTime = calculateAverage($stats.total_time, $stats.win);
</script>

<div id="stats">
	<header>
		<div class="titles my-3">
			<h1 class="text-2xl text-slate-800 dark:text-slate-50 uppercase tracking-wider">Statistik</h1>
			<small class="uppercase text-slate-600 dark:text-slate-200 text-xs">
				Anda sepanjang bermain
			</small>
		</div>
	</header>
	<main class=" p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
		<div
			class="
default: stats-cards grid gap-3 mt-3 mb-5 grid-cols-2
lar: lg:grid-cols-4
"
		>
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
			<div class="stat-card bg-rose-500">
				<i class="fas fa-stopwatch block text-6xl mt-3" />
				<span class="font-semibold text-xl text-center">
					{#if averageTime}
						{#if averageTime.minutes > 0}
							{averageTime.minutes}<span class="font-normal">minit</span>
						{/if}
						{#if averageTime.seconds > 0}
							{averageTime.seconds}<span class="font-normal">saat</span>
						{:else}
							0 saat
						{/if}
					{:else}
						0 saat
					{/if}
				</span>
				<span class="font-normal uppercase text-center text-sm tracking-wide">purata masa</span>
			</div>
			<div class="stat-card bg-blue-500">
				<i class="fas fa-star block text-6xl mt-3" />
				<span class="font-semibold text-xl text-center"
					>{$stats.total > 0 ? (($stats.win / $stats.total) * 100).toFixed(2) : 0}%</span
				>
				<span class="font-normal uppercase text-center text-sm tracking-wide">Kadar menang</span>
			</div>
		</div>
		<hr />
		<div class="game-charts my-3">
			<h2 class="text-xl uppercase tracking-wide mb-2 text-slate-800 dark:text-slate-100">Carta</h2>

			<div class="h-[250px] relative">
				{#if $stats.total > 0}
					<ModeChart stats={$stats} />
				{:else}
					<div
						class="w-full h-full bg-gray-100 dark:bg-slate-600 flex items-center justify-center text-center rounded"
					>
						<p class="text-slate-700 dark:text-slate-200">
							Tiada statistik untuk carta.
							<br />
							Sila main beberapa permainan
						</p>
					</div>
				{/if}
			</div>
		</div>
	</main>
</div>

<style>
	.stat-card {
		@apply rounded-3xl w-full py-2 px-3 text-center text-slate-50;
	}

	.stat-card > span:not(.inline) {
		@apply block;
	}
	.stat-card i {
		@apply mb-auto;
	}
</style>
