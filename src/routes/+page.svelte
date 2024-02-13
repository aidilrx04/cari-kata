<script>
	import Footer from '$lib/components/Footer.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import Ogp from '$lib/OGP.svelte';
</script>

<Meta title="Cari Kata" />
<Ogp />

<div id="app">
	<header class="mx-2 bg-gray-50 dark:bg-slate-800 py-7 px-3 my-4 rounded-xl">
		<div class="title">
			<span class="block text-slate-700 dark:text-slate-200">Selamat Datang ke</span>
			<h1 class="text-5xl text-slate-900 dark:text-slate-100 font-semibold">Cari Kata</h1>
		</div>
	</header>
	<main class="p-3 bg-gray-50 dark:bg-slate-700 mx-2">
		<section>
			<div class="flex justify-center items-center">
				<a
					href="/mode"
					class="play-button my-2 bg-violet-600 text-lg uppercase text-center rounded-md shadow-lg !text-white px-3 py-2 max-w-full mx-2 hover:bg-violet-700 transition-colors"
					>MAIN SEKARANG</a
				>
			</div>
		</section>
		<section class="about my-3 py-2">
			<h2 class="text-lg text-slate-800 dark:text-slate-50">TENTANG</h2>
			<p class="text-md text-slate-700 dark:text-slate-300">
				Cari Kata adalah sebuah aplikasi laman web permainan cari kata dalam talian. Permainan cari
				kata ialah permainan perkataan yang terdiri daripada huruf perkataan yang diletakkan dalam
				grid. Objektif permainan ini adalah untuk mencari dan menandakan semua perkataan yang
				tersembunyi di dalam grid. [<a
					class="underline text-violet-700 dark:text-violet-300"
					href="https://en.wikipedia.org/wiki/Word_search"
					rel="noreferrer"
					target="_blank">Wikipedia</a
				>]
			</p>
		</section>
	</main>
</div>
