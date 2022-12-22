<script>
	import Footer from '$lib/Footer.svelte';
	import Navigation from '$lib/Navigation.svelte';
	import ModeCard from './ModeCard.svelte';
</script>

<div class="w-[360px] mx-auto">
	<header>
		<Navigation />
		<div class="title w-[300px] mx-auto">
			<h2 class="uppercase text-2xl text-center mt-6 mb-3">Mode</h2>
		</div>
	</header>

	<main id="mode-selection" class="px-3">
		<div class="container bg-gray-50 rounded-lg max-w-full">
			<div class="modes-cards mx-auto flex justify-center items-center flex-col">
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
					<div class="title" slot="title">Biasa</div>
					<div slot="description">
						<ul class="list-disc ml-5">
							<li>8x9 grid</li>
							<li>Perkataan terbalik kurang</li>
							<li>Perkataan condong kurang</li>
						</ul>
					</div>
				</ModeCard>
				<ModeCard ctaHref="/game?mode=hard">
					<div class="title" slot="title">Susah</div>
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
	<Footer />
</div>
