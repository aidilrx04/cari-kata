<script>
	import ModeCard from './ModeCard.svelte';
</script>

<div id="mode-selection">
	<div class="title w-[300px] mx-auto">
		<h2 class="uppercase text-2xl text-center my-2">Mode</h2>
	</div>

	<div class="modes-cards mx-auto w-[300px] flex justify-center items-center flex-col">
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
