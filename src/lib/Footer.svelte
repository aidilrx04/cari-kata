<script lang="ts">
	const GITHUB_PROFILE = 'https://github.com/aidilrx04';
	const YEAR = new Date().getFullYear();
</script>

<footer class="text-center py-8 px-3 mt-6">
	&copy; {YEAR} Cari Kata
	<br />
	Dibangunkan oleh
	<a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer">@aidilrx04</a>
	<br />
	Dikuasai oleh
	<a href="http://kit.svelte.dev" target="_blank" rel="noopener noreferrer">SvelteKit</a>
</footer>

<style>
	a {
		@apply underline text-violet-700;
	}

	:global(.dark) a {
		@apply text-violet-400;
	}
</style>
