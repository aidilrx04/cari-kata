<script>
	import OGP from '$lib/OGP.svelte';
	import Footer from '$lib/Footer.svelte';
	import Meta from '$lib/Meta.svelte';
	import Navigation from '$lib/Navigation.svelte';
	import ModeCard from './ModeCard.svelte';
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
			<ModeCard ctaHref="/game?mode=easy">
				<div class="title" slot="title">Mudah</div>
				<div slot="description">
					<ul class="list-disc ml-5">
						<li>8x9 grid</li>
						<li>Perkataan terbalik kurang</li>
						<li>Perkataan condong kurang</li>
					</ul>
				</div>
			</ModeCard>
			<ModeCard ctaHref="/game?mode=normal">
				<div class="title" slot="title">Sederhana</div>
				<div slot="description">
					<ul class="list-disc ml-5">
						<li>8x9 grid</li>
						<li>Perkataan terbalik kurang</li>
						<li>Perkataan condong kurang</li>
					</ul>
				</div>
			</ModeCard>
			<ModeCard ctaHref="/game?mode=hard">
				<div class="title" slot="title">Sukar</div>
				<div slot="description">
					<ul class="list-disc ml-5">
						<li>8x9 grid</li>
						<li>Perkataan terbalik kurang</li>
						<li>Perkataan condong kurang</li>
					</ul>
				</div>
			</ModeCard>
		</div>
	</div>
</main>
