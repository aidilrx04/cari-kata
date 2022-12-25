<script lang="ts">
	import Footer from '$lib/Footer.svelte';
	import Navigation from '$lib/Navigation.svelte';
	import '../app.css';
</script>

<Navigation />
<div class="max-w-screen-xl mx-auto">
	<div class="px-3">
		<slot />
		<Footer />
	</div>
</div>

<style global>
	body {
		@apply bg-slate-100 text-slate-800;
	}
</style>
