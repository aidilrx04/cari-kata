<script>
	import Accordion from './accordion/Accordion.svelte';
	import AccordionItem from './accordion/AccordionItem.svelte';
</script>

<header class="my-3">
	<div class="title">
		<h1 class="uppercase text-2xl text-slate-800 tracking-wide">Tutorial</h1>
	</div>
</header>
<main class="my-3 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg" id="tutorial">
	<Accordion>
		<AccordionItem>
			<span slot="title">Cara bermain</span>
			<div slot="content">
				<section>
					<p>
						Setelah mulakan permainan, anda perlu mencari perkataan-perkataan tersembunyi di dalam
						grid.
					</p>
					<img src="/tutorial/start.png" alt="start" />
				</section>
				<section>
					<p>
						Untuk melengkapkan sesuatu perkataan, anda perlu ketik pada huruf permulaan perkataan
						dan seret tetikus atau jejari anda sehingga perkataan lengkap.
						<br />
						(Anda juga boleh bermula daripada huruf yang terakhir.)
					</p>
					<img src="/tutorial/drag.png" alt="drag" />
				</section>
				<section>
					<p>
						Setelah lengkap semua perkataan, lepas tetikus atau jari anda untuk melengkapkan
						perkataan tersebut.
					</p>
					<img src="/tutorial/release.png" alt="release" />
				</section>
				<section>
					<p>Akhirnya, lengkapkan semua perkataan untuk memenangi permainan ini</p>
					<img src="/tutorial/win.png" alt="win" />
				</section>
			</div>
		</AccordionItem>
	</Accordion>
</main>

<style>
	#tutorial section {
		@apply mb-10;
	}
	#tutorial p,
	#tutorial img {
		@apply mb-3;
	}
</style>
