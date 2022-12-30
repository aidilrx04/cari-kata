<script>
	import OGP from '$lib/OGP.svelte';
	import Meta from '$lib/Meta.svelte';
	import ModeCard from './ModeCard.svelte';
	import { MODES, MODE_TYPES } from '$lib/modes';
	import { onDestroy } from 'svelte';

	const cards = [
		{
			title: MODE_TYPES[MODES.EASY].title,
			description: `
			<ul class="list-disc desc-list">
				<li>${MODE_TYPES[MODES.EASY].grid.column}x${MODE_TYPES[MODES.EASY].grid.row} grid</li>
				<li>Perkataan terbalik kurang</li>
				<li>Perkataan condong kurang</li>
			</ul>
			`,
			url: '/game?mode=easy',
			cta_label: 'MAIN'
		},
		{
			title: MODE_TYPES[MODES.NORMAL].title,
			description: `
			<ul class="list-disc desc-list">
				<li>${MODE_TYPES[MODES.NORMAL].grid.column}x${MODE_TYPES[MODES.HARD].grid.row} grid</li>
				<li>Perkataan terbalik biasa</li>
				<li>Perkataan condong biasa</li>
			</ul>
			`,
			url: '/game?mode=normal',
			cta_label: 'MAIN'
		},
		{
			title: MODE_TYPES[MODES.HARD].title,
			description: `
			<ul class="list-disc desc-list">
				<li>${MODE_TYPES[MODES.HARD].grid.column}x${MODE_TYPES[MODES.HARD].grid.row} grid</li>
				<li>Perkataan terbalik banyak</li>
				<li>Perkataan condong banyak</li>
			</ul>
			`,
			url: '/game?mode=hard',
			cta_label: 'MAIN'
		},
		{
			title: MODE_TYPES[MODES.IMPOSSIBLE].title,
			description: `
			<ul class="list-disc desc-list"> 
				<li>13x15 grid</li>
				<li>Sebahagian huruf disembunyikan</li>
				<li>Segala daripada Sukar</li>
			</ul>
			`,
			url: '/game?mode=impossible',
			cta_label: 'MAIN'
		}
	];

	let disabled = false;

	onDestroy(() => {
		disabled = false;
	});
</script>

<Meta title="Pilih Mode | Cari Kata" description="Pilih mode untuk bermain cari kata sekarang" />
<OGP title="Pilih Mode | Cari Kata" description="Pilih mode untuk bermain cari kata sekarang" />

<header>
	<div class="title mx-auto">
		<h2 class="uppercase text-2xl text-center mt-6 mb-3">Mode</h2>
	</div>
</header>

<main id="mode-selection" class="p-3 bg-gray-50 rounded-lg max-w-full">
	<div class="max-w-screen-lg mx-auto">
		<div
			class="
		w-full
	modes-cards flex justify-center items-center flex-col 
	md:inline-grid md:grid-cols-2 md:gap-5 sm:place-content-center
	lg:grid-cols-3
	"
		>
			{#each cards as card}
				<ModeCard ctaHref={card.url} ctaLabel={card.cta_label} bind:disabled>
					<div slot="title">{card.title}</div>
					<div slot="description">
						{@html card.description}
					</div>
				</ModeCard>
			{/each}
		</div>
	</div>

	<style>
		ul.desc-list {
			@apply ml-5;
		}
	</style>
</main>
